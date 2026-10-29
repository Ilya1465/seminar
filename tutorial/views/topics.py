from django.http import Http404
from django.shortcuts import render

from tutorial.access import lesson_states, solved_urlnames, topic_states, user_level
from tutorial.topic_cards import cards_for_topic_lesson
from tutorial.topics import all_topics, get_topic


def topics_index(request):
    solved = solved_urlnames(request.user)
    from tutorial.coins import pending_chests
    return render(request, 'topics.html', {'topic_states': topic_states(all_topics(), solved, user_level(request.user)), 'chests': pending_chests(request.user)})


def topic(request, slug):
    topic_data = get_topic(slug)
    if topic_data is None:
        raise Http404
    solved = solved_urlnames(request.user)
    topics = all_topics()
    index = next(i for i, t in enumerate(topics) if t['slug'] == slug)
    topic_unlocked = index == 0 or topic_states(topics[:index + 1], solved, user_level(request.user))[-1][1]
    return render(request, 'topic.html', {
        'topic': topic_data,
        'lesson_states': lesson_states(topic_data, solved),
        'topic_unlocked': topic_unlocked,
    })


def topic_lesson(request, slug, order):
    topic_data = get_topic(slug)
    if topic_data is None or not 1 <= order <= len(topic_data['lessons']):
        raise Http404
    solved = solved_urlnames(request.user)
    states = lesson_states(topic_data, solved)
    topics = all_topics()
    index = next(i for i, t in enumerate(topics) if t['slug'] == slug)
    topic_unlocked = index == 0 or topic_states(topics[:index + 1], solved, user_level(request.user))[-1][1]
    tlesson = topic_data['lessons'][order - 1]
    lessons = topic_data['lessons']
    if not topic_unlocked or not states[order - 1][1]:
        # Урок под замком: показываем заглушку со ссылкой на предыдущий шаг.
        return render(request, 'topic_locked.html', {
            'topic': topic_data,
            'order': order,
            'total': len(topic_data['lessons']),
            'back_url': '/topics/%s/%d/' % (slug, order - 1) if order > 1 else '/topics/%s/' % slug,
        }, status=423)
    if order < len(lessons):
        problems_url = '/topics/%s/%d/' % (slug, order + 1)
    else:
        problems_url = '/topics/%s/' % slug
    if topic_data.get('module') == 1:
        # Модуль 1: урок = студия «Мир героя» со сгенерированным уровнем.
        import json as _json
        from django.utils.html import strip_tags
        from tutorial.scratch_levels import level_for, mission_for
        note = ''
        for card in tlesson.get('cards', []):
            if card.get('type') == 'theory':
                text = strip_tags(card.get('html', ''))
                # Обрезаем по границе предложения, а не посреди слова.
                note = text[:text.find('. ', 60) + 1] if '. ' in text[60:] else text[:220]
                break
        level = level_for(slug, order, tlesson['title'], '')
        level['intro'] = mission_for(level)
        if order < len(lessons):
            next_url = '/topics/%s/%d/' % (slug, order + 1)
        else:
            topics = all_topics()
            index = next(i for i, t in enumerate(topics) if t['slug'] == slug)
            next_url = '/topics/%s/1/' % topics[index + 1]['slug'] if index + 1 < len(topics) else '/topics/'
        return render(request, 'scratch_level.html', {
            'level': level,
            'order': order,
            'total': len(lessons),
            'next_level': None,
            'next_url': next_url,
            'crumb_topic': topic_data['title'],
            'crumb_topic_url': '/topics/%s/' % slug,
            'lesson_note': note,
            'level_json': _json.dumps(level, ensure_ascii=False),
        })
    if 'cards' in tlesson:
        # Уроки модуля Scratch несут готовые карточки (теория и викторины).
        from tutorial.lesson_cards import FINAL_CARD, _prepare
        cards = _prepare([dict(card) for card in tlesson['cards']] + [dict(FINAL_CARD)])
    else:
        cards = cards_for_topic_lesson(tlesson, [p for item in lessons for p in item['problems']])
    return render(request, 'topic_lesson.html', {
        'topic': topic_data,
        'tlesson': tlesson,
        'order': order,
        'total': len(lessons),
        'cards': cards,
        'problems_url': problems_url,
    })
