"""Уровни студии Scratch: мир героя + программа из оригинальных блоков.

grid: '.' свободная клетка, '#' дерево, 'G' звезда (их может быть несколько).
dir: 0 вверх, 1 вправо, 2 вниз, 3 влево. par — рекомендуемое число блоков.
"""

LEVELS = [
    {
        'slug': 'first-step',
        'title': 'Первый шаг',
        'intro': 'Кот хочет звезду! Каждый блок «двигаться» — одна клетка. Собери программу и нажми «Играть».',
        'grid': ['.....', 'S...G', '.....', '.....', '.....'],
        'start': [0, 1], 'goal': [[4, 1]], 'dir': 1,
        'blocks': ['forward'], 'par': 4,
    },
    {
        'slug': 'turn-right',
        'title': 'Поворот к звезде',
        'intro': 'Звезда не по прямой. Герой едет туда, куда смотрит: добавь поворот.',
        'grid': ['.....', '...#.', '....G'],
        'start': [0, 0], 'goal': [[4, 2]], 'dir': 1,
        'blocks': ['forward', 'left', 'right'], 'par': 7,
    },
    {
        'slug': 'long-bridge',
        'title': 'Длинный мост',
        'intro': 'Мост длинный. Уложись в два блока: «повторить» + «двигаться».',
        'grid': ['#######', 'S.....G', '#######'],
        'start': [0, 1], 'goal': [[6, 1]], 'dir': 1,
        'blocks': ['forward', 'repeat'], 'par': 2,
    },
    {
        'slug': 'zigzag',
        'title': 'Зигзаг между деревьями',
        'intro': 'Дорога петляет, а деревья кусаются. Используй повороты — или петли, чтобы блоков было меньше.',
        'grid': ['.......', '#.#...#', '#.#.#.G', '#.#.#.#', '.......'],
        'start': [0, 0], 'goal': [[6, 2]], 'dir': 1,
        'blocks': ['forward', 'left', 'right', 'repeat'], 'par': 7,
    },
    {
        'slug': 'until-star',
        'title': 'Пока не у звезды',
        'intro': 'Петля «повторять пока не касается звезды» сама знает, когда остановиться. Положи в неё «двигаться».',
        'grid': ['...##.', 'S....G', '...##.'],
        'start': [0, 1], 'goal': [[5, 1]], 'dir': 1,
        'blocks': ['forward', 'until'], 'par': 2,
    },
    {
        'slug': 'little-maze',
        'title': 'Маленький лабиринт',
        'intro': 'По коридорам к звезде: смотри на карту и планируй маршрут заранее.',
        'grid': ['.......', '#...#.#', '.#.....', '..#..#.', '......G'],
        'start': [0, 0], 'goal': [[6, 4]], 'dir': 1,
        'blocks': ['forward', 'left', 'right', 'repeat'], 'par': 11,
    },
    {
        'slug': 'double-stars',
        'title': 'Две звезды',
        'intro': 'На поле две звезды — собери обе! Программа не заканчивается на первой звезде.',
        'grid': ['.......', 'S..G...', '.#..#..', '......G'],
        'start': [0, 1], 'goal': [[3, 1], [6, 3]], 'dir': 1,
        'blocks': ['forward', 'left', 'right', 'repeat'], 'par': 9,
    },
    {
        'slug': 'star-feast',
        'title': 'Праздник звёзд',
        'intro': 'Финал: три звезды на одном поле. Петли помогут держать программу короткой.',
        'grid': ['S..G...', '.......', '....G.G', '.......', '.......'],
        'start': [0, 0], 'goal': [[3, 0], [4, 2], [6, 2]], 'dir': 1,
        'blocks': ['forward', 'left', 'right', 'repeat', 'until'], 'par': 11,
    },
]


def get_level(slug):
    for level in LEVELS:
        if level['slug'] == slug:
            return level
    return None


# --- Уровни для уроков Модуля 1: генерируются по теме и номеру урока ---

# Какие блоки доступны в каждой теме модуля 1.
TOPIC_BLOCKS = {
    # Базовые десять
    'scratch-intro': ['forward'],
    'scratch-motion': ['forward', 'left', 'right'],
    'scratch-events': ['forward', 'left', 'right'],
    'scratch-looks': ['forward', 'left', 'right', 'costume'],
    'scratch-loops': ['forward', 'left', 'right', 'repeat', 'until'],
    'scratch-if': ['forward', 'left', 'right', 'repeat', 'if'],
    'scratch-variables': ['forward', 'left', 'right', 'repeat', 'if', 'score'],
    'scratch-sound': ['forward', 'left', 'right', 'repeat', 'if', 'meow'],
    'scratch-project-apple': ['forward', 'left', 'right', 'repeat', 'until', 'if'],
    'scratch-project-card': ['forward', 'left', 'right', 'repeat', 'until', 'if'],
    # Движение
    'scratch-steps': ['forward'],
    'scratch-turns-180': ['forward', 'left', 'right'],
    'scratch-squares': ['forward', 'left', 'right'],
    'scratch-zigzag-ways': ['forward', 'left', 'right'],
    'scratch-maze-1': ['forward', 'left', 'right'],
    'scratch-maze-2': ['forward', 'left', 'right'],
    'scratch-routes': ['forward', 'left', 'right'],
    'scratch-short-path': ['forward', 'left', 'right'],
    'scratch-speed': ['forward', 'left', 'right', 'wait'],
    # Внешний вид
    'scratch-say': ['forward', 'left', 'right', 'say'],
    'scratch-think': ['forward', 'left', 'right', 'think'],
    'scratch-hide-show': ['forward', 'left', 'right', 'hide', 'show'],
    'scratch-costumes': ['forward', 'left', 'right', 'costume'],
    'scratch-dialogs': ['forward', 'left', 'right', 'say', 'think'],
    'scratch-showman': ['forward', 'left', 'right', 'costume', 'say'],
    'scratch-effects-show': ['forward', 'costume', 'repeat'],
    # Звук
    'scratch-meow': ['forward', 'left', 'right', 'meow'],
    'scratch-rhythm': ['forward', 'meow', 'wait', 'repeat'],
    'scratch-fanfare': ['forward', 'left', 'right', 'meow', 'say'],
    'scratch-signals': ['forward', 'left', 'right', 'meow'],
    'scratch-concert': ['forward', 'meow', 'costume', 'wait'],
    # События
    'scratch-flag': ['forward', 'left', 'right'],
    'scratch-reactions': ['forward', 'left', 'right'],
    'scratch-messages': ['forward', 'left', 'right'],
    'scratch-parallel': ['forward', 'left', 'right'],
    # Управление
    'scratch-repeat': ['forward', 'left', 'right', 'repeat'],
    'scratch-repeat-n': ['forward', 'left', 'right', 'repeat'],
    'scratch-nested': ['forward', 'left', 'right', 'repeat'],
    'scratch-until': ['forward', 'until'],
    'scratch-until-tree': ['forward', 'left', 'right', 'until'],
    'scratch-until-edge': ['forward', 'until'],
    'scratch-if-tree': ['forward', 'left', 'right', 'if'],
    'scratch-waiting': ['forward', 'left', 'right', 'wait'],
    'scratch-control-mix': ['forward', 'left', 'right', 'repeat', 'until', 'if'],
    # Сенсоры
    'scratch-sensors': ['forward', 'left', 'right', 'if'],
    'scratch-sensor-star': ['forward', 'until'],
    'scratch-sensor-tree2': ['forward', 'left', 'right', 'until', 'if'],
    'scratch-sensor-edge2': ['forward', 'left', 'right', 'until', 'if'],
    'scratch-smart-cat': ['forward', 'left', 'right', 'until', 'if'],
    'scratch-sensor-mix': ['forward', 'left', 'right', 'repeat', 'until', 'if'],
    # Операторы
    'scratch-operators': ['forward', 'left', 'right'],
    'scratch-compare': ['forward', 'left', 'right', 'if'],
    'scratch-random-game': ['forward', 'left', 'right'],
    # Переменные
    'scratch-score': ['forward', 'left', 'right', 'score'],
    'scratch-lives': ['forward', 'left', 'right', 'score', 'if'],
    'scratch-counter': ['forward', 'left', 'right', 'score', 'repeat'],
    'scratch-best-score': ['forward', 'left', 'right', 'score', 'until'],
    # Проекты
    'scratch-project-maze': ['forward', 'left', 'right', 'repeat', 'until', 'if'],
    'scratch-project-show': ['forward', 'left', 'right', 'say', 'costume', 'meow', 'wait'],
    'scratch-project-final': ['forward', 'left', 'right', 'repeat', 'until', 'if', 'say', 'costume', 'meow', 'score'],
}

_DIRS = ((0, -1), (1, 0), (0, 1), (-1, 0))


def _walk(rng, width, height, target, can_turn):
    """Случайный путь по полю без повторов клеток. Гарантированно проходим."""
    x, y, d = 0, height // 2, 1
    path = [(x, y)]
    actions = []
    while len(path) < target:
        dx, dy = _DIRS[d]
        fwd = (x + dx, y + dy)
        options = []
        if 0 <= fwd[0] < width and 0 <= fwd[1] < height and fwd not in path:
            options.append('forward')
        if can_turn:
            for name, nd in (('left', (d + 3) % 4), ('right', (d + 1) % 4)):
                tx, ty = _DIRS[nd]
                cell = (x + tx, y + ty)
                if 0 <= cell[0] < width and 0 <= cell[1] < height and cell not in path:
                    options.append(name)
        if not options:
            break
        if 'forward' in options and (len(options) == 1 or rng.random() < 0.6):
            x, y = fwd
            path.append((x, y))
            actions.append('forward')
        else:
            turn = rng.choice([o for o in options if o != 'forward'])
            d = (d + 3) % 4 if turn == 'left' else (d + 1) % 4
            actions.append(turn)
            dx, dy = _DIRS[d]
            x, y = x + dx, y + dy
            path.append((x, y))
            actions.append('forward')
    return path, actions


def mission_for(level):
    """Текст игрового задания: что именно нужно сделать на поле."""
    goals = len(level['goal'])
    what = 'Проведи кота к звезде.' if goals == 1 else 'Собери все звёзды: их здесь %d.' % goals
    blocks = level['blocks']
    if 'until' in blocks:
        how = 'Петля «повторять пока не касается звезды» сама знает, когда остановиться.'
    elif 'repeat' in blocks:
        how = 'Герой едет туда, куда смотрит. Повороты и петля «повторить» помогут держать программу короткой.'
    elif 'left' in blocks or 'right' in blocks:
        how = 'Герой едет туда, куда смотрит — добавляй повороты.'
    else:
        how = 'Каждый блок «двигаться» — одна клетка вперёд.'
    extra = []
    if 'score' in blocks:
        extra.append('Блок «изменить счёт» прибавляет очки — попробуй его по пути.')
    if 'meow' in blocks:
        extra.append('А на финише пусть кот скажет «мяу»!')
    if 'say' in blocks or 'think' in blocks:
        extra.append('Кот может говорить по дороге — блок «сказать».')
    if 'costume' in blocks:
        extra.append('Блок «следующий костюм» меняет цвет кота.')
    if 'hide' in blocks:
        extra.append('«Спрятаться» и «показаться» делают кота невидимым и обратно.')
    return ' '.join([what, how] + extra)


def level_for(topic_slug, order, lesson_title, intro_text):
    """Уровень для урока темы модуля 1: детерминирован, всегда проходим."""
    import random
    rng = random.Random('%s:%d' % (topic_slug, order))
    blocks = TOPIC_BLOCKS.get(topic_slug, ['forward', 'left', 'right'])
    can_turn = 'left' in blocks or 'right' in blocks
    width, height = 7, 5
    target = min(4 + order * 2, 14)
    path, actions = _walk(rng, width, height, target, can_turn)
    goal = path[-1]
    grid = []
    for y in range(height):
        row = []
        for x in range(width):
            if (x, y) == goal:
                row.append('G')
            elif (x, y) in path:
                row.append('.')
            else:
                row.append('#' if rng.random() < 0.28 else '.')
        grid.append(''.join(row))
    return {
        'slug': '%s-%d' % (topic_slug, order),
        'title': lesson_title,
        'intro': intro_text,
        'grid': grid,
        'start': [path[0][0], path[0][1]],
        'goal': [list(goal)],
        'dir': 1,
        'blocks': blocks,
        'par': max(2, len(actions)),
        'hero': 'cat',
        'show_path': order <= 2,
        'path': [list(cell) for cell in path],
    }
