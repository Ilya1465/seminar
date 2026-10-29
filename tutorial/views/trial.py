from django.shortcuts import render

from tutorial.lesson_cards import cards_for
from tutorial.models import Lesson

TRIAL_LESSON = 'inout_and_arithmetic_operations'


def trial(request):
    lesson_db = Lesson.objects.filter(urlname=TRIAL_LESSON).first()
    cards = cards_for(lesson_db) if lesson_db else []
    return render(request, 'trial.html', {'cards': cards, 'trial': True})
