"""Темы курса: Курс → Темы → Уроки. Строится программно из занятий и банка задач."""
from functools import lru_cache

from tutorial.lessons import load_lesson
from tutorial.models import Course, Lesson
from tutorial.problems import get_sorted_problems
from tutorial.views import DEFAULT_COURSE

# Сколько задач банка в одной практической теме. 134 задачи / 3 ≈ 45 тем,
# плюс 15 тем из занятий — итого около 60 тем, минимум 50 соблюдён.
PRACTICE_CHUNK = 3


def pretty_title(text):
    """Единый вид заголовков: без пробелов по краям, с большой буквы, без точки в конце."""
    text = (text or '').strip().rstrip('.')
    return text[:1].upper() + text[1:] if text else text


def _text_blocks(lesson_db):
    """Блоки теории занятия: секция/подсекция с текстом = один блок."""
    blocks = []

    def walk(section, fallback):
        title = section.get('title', '')
        if title and title != '__text__':
            fallback = title
        text = section.get('text', '')
        if text.strip():
            blocks.append({'title': pretty_title(fallback), 'theory_html': text})
        for sub in section.get('subsections', []):
            walk(sub, fallback)

    for section in load_lesson(lesson_db)['content']:
        walk(section, lesson_db.title)
    return blocks


def _split_long_blocks(blocks, minimum=5):
    """Если блоков меньше minimum, делим самые длинные по границам абзацев."""
    blocks = list(blocks)
    guard = 0
    while len(blocks) < minimum and guard < 20:
        guard += 1
        idx = max(range(len(blocks)), key=lambda i: len(blocks[i]['theory_html']))
        html = blocks[idx]['theory_html']
        cut = html.find('</p>', len(html) // 2)
        if cut == -1:
            break
        cut += len('</p>')
        blocks[idx:idx + 1] = [
            dict(blocks[idx], theory_html=html[:cut]),
            dict(blocks[idx], theory_html=html[cut:]),
        ]
    return blocks


def _course_lessons():
    course = Course.objects.get(urlname=DEFAULT_COURSE)
    return [lic.lesson for lic in course.lessonincourse_set.select_related('lesson').order_by('order')]


def _distribute(problems, count):
    """Задачи занятия — по урокам последовательными порциями: задачи урока
    соответствуют его месту в теории, а не разбросаны round-robin."""
    buckets = [[] for _ in range(count)]
    for i, problem in enumerate(problems):
        buckets[min(i * count // max(len(problems), 1), count - 1)].append(problem)
    return buckets


# В каких темах задачи начинаются позже обычного: индекс первого урока
# с заданиями (0-based). Тема 1: задачи требуют input(), а он объясняется
# только в уроке 4 «Как считать данные, которые вводит человек».
FIRST_TASK_LESSON = {
    'inout_and_arithmetic_operations': 3,
}


def _lesson_topics():
    """Темы из существующих занятий: уроки = блоки теории + задачи занятия."""
    course_lessons = _course_lessons()
    # Общий запас задач для уроков закрепления в темах без своих задач.
    pool = []
    for lesson in course_lessons:
        pool.extend(get_sorted_problems(lesson))
    topics = []
    for lesson_index, lesson in enumerate(course_lessons):
        blocks = _split_long_blocks(_text_blocks(lesson))
        problems = get_sorted_problems(lesson)
        count = max(5, len(blocks))
        lessons = []
        for i in range(count):
            block = blocks[i] if i < len(blocks) else {'title': pretty_title(lesson.title), 'theory_html': ''}
            lessons.append({
                'title': block['title'],
                'theory_html': block['theory_html'],
                'problems': [],
            })
        # Задания — только в уроки, где теория показывает код, и начиная
        # со второго такого урока: сначала введение и объяснение, потом практика.
        teachable = [i for i, item in enumerate(lessons)
                     if '<code' in item['theory_html'] or 'lesson_code' in item['theory_html']]
        targets = (teachable[1:] or teachable) or list(range(count))
        # Точная точка старта заданий для темы, где она известна (тема 1: input()
        # объясняется в уроке «Как считать данные, которые вводит человек»).
        first_task = FIRST_TASK_LESSON.get(lesson.urlname)
        if first_task is not None:
            late = [i for i in teachable if i >= first_task]
            targets = late or targets
        if not problems and pool:
            # Тема без своих задач (графы, обходы): тренируем на задачах
            # из общего запаса — иначе она открывала бы следующую тему даром.
            problems = [pool[(lesson_index * count + i) % len(pool)] for i in range(len(targets))]
        for j, i in enumerate(targets):
            lessons[i]['problems'] = _distribute(problems, len(targets))[j]
        # Оставшиеся пустые уроки — закрепление на задачах из запаса.
        for i, item in enumerate(lessons):
            if not item['theory_html'].strip() and not item['problems'] and pool:
                item['problems'] = [pool[(lesson_index + i) % len(pool)]]
                item['title'] = 'Закрепление'
        topics.append({
            'slug': lesson.urlname,
            'title': pretty_title(lesson.title),
            'description': 'Тема курса: теория по шагам и задачи с проверкой в браузере.',
            'lessons': lessons,
        })
    return topics


def _practice_topics():
    """Темы-тренировки из банка задач: 5 уроков — разминка, задачи, повторение."""
    ordered = []
    for lesson in _course_lessons():
        for problem in get_sorted_problems(lesson):
            ordered.append((lesson, problem))
    topics = []
    for start in range(0, len(ordered), PRACTICE_CHUNK):
        chunk = ordered[start:start + PRACTICE_CHUNK]
        if not chunk:
            break
        category = chunk[0][0]
        number = start // PRACTICE_CHUNK + 1
        # Теория родительской темы поддерживает практические уроки.
        blocks = _text_blocks(category)
        lessons = [{
            'title': 'Разминка',
            'theory_html': ('<p>Тренировка по теме «%s». Решайте задачи по порядку: '
                            'каждая проверяется прямо в браузере. Если застряли — '
                            'вернитесь к теории темы.</p>' % category.title),
            'problems': [],
        }]
        for lesson, problem in chunk:
            lessons.append({'title': pretty_title(problem['name']), 'theory_html': '', 'problems': [problem]})
        # Маленький хвостовой кусок: добираем уроки закреплением — следующими
        # по порядку задачами курса, чтобы тема не прыгала вперёд.
        extra = 0
        while len(lessons) < 4:
            pool_problem = ordered[(start + len(chunk) + extra) % len(ordered)][1]
            lessons.append({'title': 'Закрепление: ' + pretty_title(pool_problem['name']), 'theory_html': '', 'problems': [pool_problem]})
            extra += 1
        lessons.append({
            'title': 'Что повторить',
            'theory_html': ('<p>Если задачи дались трудно, повторите тему '
                            '«%s» и возвращайтесь — тренировка никуда не денется.</p>' % category.title),
            'problems': [],
        })
        # Раздаём блоки теории темы по урокам (кроме финального «Что повторить»).
        for idx, tlesson in enumerate(lessons[:-1]):
            if blocks:
                tlesson['theory_html'] += blocks[idx % len(blocks)]['theory_html']
        topics.append({
            'slug': 'practice-%s-%d' % (category.urlname, number),
            'title': '%s: практика %d' % (pretty_title(category.title), number),
            'description': 'Задачи по теме «%s» с проверкой в браузере.' % category.title,
            'lessons': lessons,
        })
    return topics


@lru_cache(maxsize=1)
def all_problems():
    """Все задачи курса в порядке занятий — запас для добора карточек."""
    pool = []
    for lesson in _course_lessons():
        pool.extend(get_sorted_problems(lesson))
    return pool


@lru_cache(maxsize=1)
def all_topics():
    """Весь реестр тем; кэшируется — контент курса не меняется на лету.
    Модуль 1 — Scratch (scratch_course.py), модуль 2 — Python (занятия + практики)."""
    from tutorial.scratch_course import SCRATCH_TOPICS
    topics = list(SCRATCH_TOPICS)
    for topic in _lesson_topics() + _practice_topics():
        topic['module'] = 2
        topics.append(topic)
    return topics


def get_topic(slug):
    for topic in all_topics():
        if topic['slug'] == slug:
            return topic
    return None
