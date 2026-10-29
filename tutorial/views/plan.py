from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render

from tutorial.access import solved_urlnames, start_topic_index, topic_states, user_level
from tutorial.coins import pending_chests
from tutorial.topics import all_topics

LEVEL_NAMES = {
    1: 'Новичок',
    2: 'Знаю основы',
    3: 'Уверенный',
    4: 'Продвинутый',
}

# Стартовая тема каждого уровня живёт в access.LEVEL_START_SLUG (по slug, не по индексу).

FIRST_LESSON_URL = '/lessons/inout_and_arithmetic_operations/'


@login_required
def plan(request):
    profile = request.user.userprofile
    if profile.level == 0:
        return redirect('onboarding')
    start = start_topic_index(profile.level)
    solved = solved_urlnames(request.user)
    states = dict((t['slug'], unlocked) for t, unlocked in topic_states(all_topics(), solved, profile.level))
    topics = []
    for i, topic_data in enumerate(all_topics(), 1):
        if i < start:
            continue
        topics.append({'topic': topic_data, 'order': i, 'unlocked': states[topic_data['slug']]})
    return render(request, 'plan.html', {
        'level': profile.level,
        'level_name': LEVEL_NAMES.get(profile.level, ''),
        'topics': topics,
        'first_lesson_url': FIRST_LESSON_URL,
        'chests': pending_chests(request.user),
    })
