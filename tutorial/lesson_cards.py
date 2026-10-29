"""Карточный формат урока: авторские карточки из JSON или авто-нарезка секций."""
import json
from pathlib import Path

from django.conf import settings

from tutorial.lessons import load_lesson

CARDS_DIR = Path(settings.ABSOLUTE_PREFIX) / 'lessons' / 'cards'

CARD_TYPES = {'theory', 'quiz', 'code', 'final'}

FINAL_CARD = {'type': 'final', 'title': 'Урок пройден!'}

# Сколько шагов максимум в одном уроке: теория + задачи + финал.
# Остальные задачи остаются на страницах задач и в «Моей программе».
MAX_STEPS = 10


def _valid_card(card):
    if not isinstance(card, dict) or card.get('type') not in CARD_TYPES:
        return False
    kind = card['type']
    if kind == 'theory':
        return isinstance(card.get('html'), str)
    if kind == 'quiz':
        options = card.get('options')
        return (isinstance(card.get('question'), str)
                and isinstance(options, list) and len(options) >= 2
                and any(option.get('correct') for option in options if isinstance(option, dict))
                and all(isinstance(option, dict) and isinstance(option.get('text'), str) for option in options))
    if kind == 'code':
        tests = card.get('tests')
        return (isinstance(card.get('task'), str)
                and isinstance(tests, list) and len(tests) >= 1
                and all(isinstance(test, dict) and isinstance(test.get('stdin'), str) and isinstance(test.get('answer'), str) for test in tests))
    return True


def _load_json_cards(path):
    try:
        data = json.loads(path.read_text(encoding='utf-8'))
    except (OSError, ValueError, UnicodeDecodeError):
        return None
    cards = data.get('cards') if isinstance(data, dict) else None
    if not isinstance(cards, list) or not cards or not all(_valid_card(card) for card in cards):
        return None
    return cards


def _sub_cards(section, cards, fallback_title):
    """Каждый подраздел — отдельная карточка: меньше текста на экране.
    Заголовок '__text__' означает «без названия» — берём ближайший
    осмысленный заголовок с уровня выше."""
    title = section.get('title', '')
    if title and title != '__text__':
        fallback_title = title
    text = section.get('text', '')
    if text.strip():
        cards.append({
            'type': 'theory',
            'title': fallback_title,
            'html': text,
        })
    for subsection in section.get('subsections', []):
        _sub_cards(subsection, cards, fallback_title)


def _auto_cards(lesson_db):
    lesson = load_lesson(lesson_db)
    cards = []
    for section in lesson['content']:
        _sub_cards(section, cards, lesson['title'])
    return cards


def _prepare(cards):
    for card in cards:
        if card.get('type') == 'code':
            card['tests_json'] = json.dumps(card.get('tests', []), ensure_ascii=False)
        if card.get('type') == 'blocks':
            card['level_json'] = json.dumps(card.get('level', {}), ensure_ascii=False)
    return cards


def _problem_cards(problems):
    """Задачи урока как карточки с кодом: условие + проверка на двух публичных тестах."""
    from tutorial.beginner import guide
    cards = []
    for problem in problems:
        tests = [{'stdin': stdin, 'answer': answer}
                 for stdin, answer in zip(problem.get('tests', []), problem.get('answers', []))][:2]
        if not tests:
            continue
        starter_info = guide(problem['urlname'])
        cards.append({
            'type': 'code',
            'title': 'Задача: ' + problem['name'],
            'task': problem.get('statement', ''),
            'code': starter_info['code'] if starter_info else '',
            'tests': tests,
            'slug': problem['urlname'],
            'hint': starter_info['hint'] if starter_info else '',
        })
    return cards


def _with_problems(cards, problems):
    """Карточки задач — после всей теории урока, финал — в конце.
    Задач не больше, чем помещается в MAX_STEPS шагов урока."""
    if not problems:
        return cards
    problem_cards = _problem_cards(problems)
    if not problem_cards:
        return cards
    if cards and cards[-1].get('type') == 'final':
        limit = max(0, MAX_STEPS - len(cards))
        return cards[:-1] + problem_cards[:limit] + cards[-1:]
    limit = max(0, MAX_STEPS - len(cards) - 1)
    return cards + problem_cards[:limit]


def cards_for(lesson_db, problems=None):
    """Список карточек урока: авторские из lessons/cards/<urlname>.json, иначе авто-нарезка."""
    path = CARDS_DIR / (lesson_db.urlname + '.json')
    if path.exists():
        cards = _load_json_cards(path)
        if cards is not None:
            return _prepare(_with_problems(cards, problems))
    return _prepare(_with_problems(_auto_cards(lesson_db) + [dict(FINAL_CARD)], problems))
