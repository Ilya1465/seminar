"""Игровая валюта: монеты за уроки, сундуки за темы, бонусы."""
import random

from django.db.models import Sum

from tutorial.access import lesson_complete, solved_urlnames, topic_complete
from tutorial.models import Chest, CoinTransaction
from tutorial.topics import all_topics

LESSON_REWARD = 10
REGISTER_REWARD = 20
CHEST_REWARDS = (25, 50, 50, 75, 100)


def balance(user):
    total = CoinTransaction.objects.filter(user=user).aggregate(total=Sum('amount'))['total']
    return total or 0


def award(user, amount, reason, ref):
    """Начисляет монеты один раз на (reason, ref). True, если начислили."""
    _, created = CoinTransaction.objects.get_or_create(
        user=user, reason=reason, ref=ref, defaults={'amount': amount})
    return created


def pending_chests(user):
    if not user.is_authenticated:
        return []
    return list(Chest.objects.filter(user=user, opened=False))


def on_problem_solved(user, urlname):
    """Вызывается после принятой посылки: монеты за урок, сундук за тему.

    Задача входит в несколько тем (основная + практики), поэтому монеты за
    урок начисляем только по первой теме с этой задачей — иначе одна задача
    фармила бы монеты сразу в нескольких темах. Сундук же получает каждая
    тема, которая стала пройденной именно этим решением."""
    if not user.is_authenticated:
        return
    solved = solved_urlnames(user)
    rewarded = False
    for topic in all_topics():
        contains = any(p['urlname'] == urlname for item in topic['lessons'] for p in item['problems'])
        if not contains:
            continue
        if not rewarded:
            for order, tlesson in enumerate(topic['lessons'], 1):
                # Монеты — за уроки с заданиями; чистая теория награды не даёт.
                if tlesson['problems'] and lesson_complete(tlesson, solved):
                    award(user, LESSON_REWARD, 'lesson', '%s:%d' % (topic['slug'], order))
            rewarded = True
        if topic_complete(topic, solved):
            Chest.objects.get_or_create(
                user=user, topic=topic['slug'],
                defaults={'reward': random.choice(CHEST_REWARDS)})


def open_chests(user):
    """Открывает все ожидающие сундуки. Возвращает (выигрыш, баланс)."""
    chests = list(Chest.objects.select_for_update().filter(user=user, opened=False))
    total = 0
    for chest in chests:
        chest.opened = True
        chest.save(update_fields=['opened'])
        award(user, chest.reward, 'chest', chest.topic)
        total += chest.reward
    return total, balance(user)
