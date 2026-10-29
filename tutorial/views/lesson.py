from django import template
from django.shortcuts import render, get_object_or_404

from tutorial.lessons import load_lesson
from tutorial.lesson_cards import cards_for
from tutorial.access import solved_urlnames, topic_states
from tutorial.models import Course, Lesson, UserProfile
from tutorial.problems import get_sorted_problems
from tutorial.topics import all_topics
from tutorial.views import DEFAULT_COURSE, need_admin


def lesson_in_course(request, lesson_name):
    course = get_object_or_404(Course, urlname=DEFAULT_COURSE)
    lesson_db = get_object_or_404(Lesson, urlname=lesson_name, lessonincourse__course=course)

    lessons = list(course.lessonincourse_set.select_related('lesson').order_by('order'))
    lesson_in_course = lesson_db.lessonincourse_set.get(course=course)

    # Соседи по курсу для навигации в конце урока. Список передаётся в
    # шаблон целиком (sidebar его уже перебирает), а индекс считается
    # здесь, потому что в шаблоне нет способа найти позицию элемента.
    position = next((i for i, lic in enumerate(lessons)
                     if lic.lesson_id == lesson_db.id), None)
    previous_lesson = lessons[position - 1] if position else None
    next_lesson = lessons[position + 1] if position is not None and position + 1 < len(lessons) else None

    problems = get_sorted_problems(lesson=lesson_db)
    from tutorial.problems import set_statuses
    set_statuses(request.user, problems)

    # Замок: занятие доступно, если предыдущая тема пройдена.
    topics = all_topics()
    topic_index = next((i for i, t in enumerate(topics) if t['slug'] == lesson_db.urlname), None)
    if topic_index is not None:
        solved = solved_urlnames(request.user)
        if not topic_states(topics[:topic_index + 1], solved)[-1][1]:
            from django.shortcuts import render as render_locked
            return render_locked(request, 'topic_locked.html', {
                'topic': topics[topic_index],
                'order': 1,
                'total': 1,
                'back_url': '/topics/%s/' % topics[topic_index - 1]['slug'] if topic_index else '/topics/',
            }, status=423)

    lesson = load_lesson(lesson_db)

    cards = cards_for(lesson_db, problems)
    cards_mode = request.GET.get('view') != 'full'
    # В карточном режиме задачи живут внутри плеера, поэтому финальная
    # карточка ведёт на следующее занятие.
    next_lesson_url = '/lessons/%s/' % next_lesson.lesson.urlname if next_lesson else '/plan/'

    ai_kind, ai_slug = 'lesson', lesson_name
    return render(request, 'lesson.html', locals())
