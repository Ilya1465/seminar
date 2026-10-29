import json

from django.http import Http404
from django.shortcuts import render

from tutorial.scratch_levels import LEVELS, get_level


def scratch_index(request):
    return render(request, 'scratch_index.html', {'levels': LEVELS})


def scratch_level(request, slug):
    level = get_level(slug)
    if level is None:
        raise Http404
    order = next(i for i, item in enumerate(LEVELS) if item['slug'] == slug)
    next_level = LEVELS[order + 1] if order + 1 < len(LEVELS) else None
    return render(request, 'scratch_level.html', {
        'level': level,
        'order': order + 1,
        'total': len(LEVELS),
        'next_level': next_level,
        'level_json': json.dumps(level, ensure_ascii=False),
    })
