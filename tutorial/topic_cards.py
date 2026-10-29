"""Сборка карточек урока темы: дробление теории, автовикторины, минимум шагов."""
from html.parser import HTMLParser

from django.utils.html import escape

from tutorial.lesson_cards import FINAL_CARD, _prepare, _problem_cards

# Минимум шагов (карточек) в одном уроке, включая финальную.
MIN_STEPS = 10


class _BlockSplitter(HTMLParser):
    """Делит HTML на куски по границам элементов верхнего уровня.

    Регулярка здесь небезопасна: <div class="lesson_code"> (визуализатор)
    содержит вложенные элементы, и разрыв внутри него ломал страницу —
    незакрытый div «проглатывал» кнопки навигации плеера."""

    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.chunks = []
        self.depth = 0
        self.buf = []

    def _flush(self):
        chunk = ''.join(self.buf).strip()
        if chunk:
            self.chunks.append(chunk)
        self.buf = []

    def handle_starttag(self, tag, attrs):
        self.depth += 1
        self.buf.append(self.get_starttag_text())

    def handle_startendtag(self, tag, attrs):
        self.buf.append(self.get_starttag_text())

    def handle_endtag(self, tag):
        self.depth = max(0, self.depth - 1)
        self.buf.append('</%s>' % tag)
        if self.depth == 0:
            self._flush()

    def handle_data(self, data):
        self.buf.append(data)

    def handle_entityref(self, name):
        self.buf.append('&%s;' % name)

    def handle_charref(self, name):
        self.buf.append('&#%s;' % name)

    def close(self):
        super().close()
        self._flush()


def split_theory(html):
    """Делит отрендеренный HTML теории на отдельные блоки — по одному на карточку."""
    splitter = _BlockSplitter()
    splitter.feed(html)
    splitter.close()
    merged = []
    for chunk in splitter.chunks:
        # Короткие текстовые обрывки присоединяем к предыдущему блоку.
        if merged and (len(chunk) < 160 or not chunk.startswith('<')):
            merged[-1] += chunk
        else:
            merged.append(chunk)
    return [chunk for chunk in merged if chunk.strip()]


def quiz_for(problem):
    """Викторина «предскажи вывод» из тестов задачи. None, если тестов нет."""
    tests = problem.get('tests', [])
    answers = problem.get('answers', [])
    pairs = [(stdin, answer) for stdin, answer in zip(tests, answers) if answer.strip()]
    if not pairs:
        return None
    stdin, answer = pairs[0]
    answer = answer.strip()
    distractors = []
    for _, other in pairs[1:]:
        if other.strip() != answer and other.strip() not in distractors:
            distractors.append(other.strip())
    # Если своих ответов мало, добавим числовую мутацию.
    if len(distractors) < 2 and answer.lstrip('-').isdigit():
        value = int(answer)
        for delta in (1, -1, 2):
            candidate = str(value + delta)
            if candidate not in distractors and candidate != answer:
                distractors.append(candidate)
    # Универсальные неправильные варианты всегда правдоподобны.
    for generic in ('Программа завершится с ошибкой', 'Ничего не выведет'):
        if len(distractors) >= 2:
            break
        distractors.append(generic)
    question = 'При входе <pre class="trial-demo">%s</pre> что выведет правильная программа?' % (
        escape(stdin.strip()) or '(пустой ввод)')
    options = [{'text': '<code>%s</code>' % escape(answer), 'correct': True}]
    options += [{'text': escape(item) if ' ' in item else '<code>%s</code>' % escape(item), 'correct': False}
                for item in distractors[:2]]
    return {
        'type': 'quiz',
        'title': 'Предскажи результат',
        'question': question,
        'options': options,
        'explain': 'Правильный вывод: %s. Такая программа получится у вас после решения задачи.' % escape(answer),
    }


def cards_for_topic_lesson(tlesson, topic_problems):
    """Карточки урока: теория по блокам, викторины и задачи, минимум MIN_STEPS шагов."""
    cards = []
    html = tlesson.get('theory_html', '')
    if html.strip():
        for chunk in split_theory(html):
            cards.append({'type': 'theory', 'title': tlesson['title'], 'html': chunk})

    # Сначала вся теория урока, затем задания: задача не должна встретиться
    # раньше объяснения темы.
    practice = []
    for problem in tlesson.get('problems', []):
        quiz = quiz_for(problem)
        if quiz:
            practice.append(quiz)
        practice += _problem_cards([problem])
    cards += practice

    # Добираем до MIN_STEPS только уроки с заданиями: сначала дробим длинную
    # теорию мельче, потом викторины и задачи из запаса темы и всего курса.
    # Урок чистой теории (введение) заданиями не разбавляем.
    from tutorial.topics import all_problems
    own = tlesson.get('problems', [])
    pool = [problem for problem in topic_problems if problem not in own]
    pool += [problem for problem in all_problems() if problem not in own and problem not in topic_problems]
    guard = 0
    while own and len(cards) < MIN_STEPS - 1 and guard < 30:
        guard += 1
        theory_idx = [i for i, card in enumerate(cards) if card['type'] == 'theory']
        splittable = [i for i in theory_idx if len(split_theory(cards[i]['html'])) > 1]
        if splittable:
            i = max(splittable, key=lambda j: len(cards[j]['html']))
            chunks = split_theory(cards[i]['html'])
            half = len(chunks) // 2
            cards[i:i + 1] = [dict(cards[i], html=''.join(chunks[:half])),
                              dict(cards[i], html=''.join(chunks[half:]))]
            continue
        if pool:
            problem = pool.pop(0)
            quiz = quiz_for(problem)
            # Добор — строго в конец: после теории и задач самого урока.
            if quiz:
                cards.append(quiz)
                continue
            extra = _problem_cards([problem])
            if extra:
                cards.extend(extra)
                continue
        break

    cards.append(dict(FINAL_CARD))
    return _prepare(cards)
