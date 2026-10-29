"""Последовательное открытие: уроки и темы под замком, пока не решены предыдущие."""
from tutorial.models import Submission

# Посылки со статусами «ok» и «accepted» считают задачу решённой.
SOLVED_STATUSES = (1, 2)

# С какой темы начинает пользователь в зависимости от уровня из опроса.
# Привязка по slug: модуль 1 (Scratch) растёт и индексы плавают.
LEVEL_START_SLUG = {
    1: None,         # новичок: с самого начала, со Scratch
    2: 'str',        # знаю основы: модуль 2, тема «Строки»
    3: 'functions',  # уверенный: модуль 2, тема «Функции и рекурсия»
    4: 'functions',
}


def start_topic_index(level):
    """Позиция (1-based) стартовой темы уровня в реестре all_topics()."""
    slug = LEVEL_START_SLUG.get(level)
    if not slug:
        return 1
    from tutorial.topics import all_topics
    for i, topic_data in enumerate(all_topics()):
        if topic_data['slug'] == slug:
            return i + 1
    return 1


def user_level(user):
    if not user.is_authenticated:
        return 0
    profile = getattr(user, 'userprofile', None)
    return profile.level if profile else 0


def solved_urlnames(user):
    """Множество urlname решённых задач одним запросом; у анонимов пусто."""
    if not user.is_authenticated:
        return frozenset()
    return frozenset(
        Submission.objects.filter(user=user, status__in=SOLVED_STATUSES)
        .values_list('problem__urlname', flat=True)
    )


def lesson_complete(tlesson, solved):
    """Урок пройден, когда решены все его задачи. Урок без задач пройден сразу."""
    return all(problem['urlname'] in solved for problem in tlesson['problems'])


def lesson_states(topic_data, solved):
    """[(урок, unlocked, complete)]: урок открыт, если пройден предыдущий."""
    states = []
    previous_complete = True
    for tlesson in topic_data['lessons']:
        complete = lesson_complete(tlesson, solved)
        states.append((tlesson, previous_complete, complete))
        previous_complete = complete
    return states


def topic_complete(topic_data, solved):
    return all(lesson_complete(tlesson, solved) for tlesson in topic_data['lessons'])


def topic_states(topics, solved, level=0):
    """[(тема, unlocked)]: тема открыта, если пройдена предыдущая тема
    своего модуля. Первая тема каждого модуля открыта всегда; модуль 1
    (Scratch) — свободная площадка без задач, там замков нет.
    Темы до стартовой точки уровня пользователя открыты сразу."""
    start = start_topic_index(level)
    states = []
    previous_complete = True
    previous_module = None
    for i, topic_data in enumerate(topics):
        module = topic_data.get('module', 2)
        if module != previous_module:
            previous_complete = True  # граница модулей сбрасывает цепочку замков
            previous_module = module
        states.append((topic_data, previous_complete or (i + 1) < start))
        previous_complete = topic_complete(topic_data, solved)
    return states
