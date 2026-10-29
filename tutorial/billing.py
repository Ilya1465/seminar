# -*- coding: utf-8 -*-
"""Tariffs, quota policy and a thin payment-provider facade.

A full card/SBP gateway (e.g. YooKassa) can be plugged in later behind
``PaymentProvider`` without touching the rest of the code. Until then the
`test` provider simply activates the plan (a self-hosted install with no
merchant account uses admin-issued promo codes as the acquisition channel).
"""
from datetime import timedelta
from django.conf import settings
from django.utils import timezone


PLANS = {
    'free': {
        'title': 'Свободный',
        'price': 0,
    },
    'premium': {
        'title': 'Премиум',
    },
}


def plan_of(user):
    """Effective plan key ('free' or 'premium') for a user."""
    profile = getattr(user, 'userprofile', None)
    if profile is None:
        return 'free'
    return profile.effective_plan


def ai_daily_limits():
    """Daily assistant question limits per plan, read at call time so that
    settings overrides (tests, deployments) are honoured."""
    return {
        'free': int(getattr(settings, 'TUTOR_AI_DAILY_LIMIT', 60)),
        'premium': int(getattr(settings, 'PREMIUM_AI_DAILY_LIMIT', 180)),
    }


def ai_daily_limit(user):
    return ai_daily_limits()[plan_of(user)]


def api_multiplier(user):
    """Rate-limit multiplier for a user; Premium clients get more headroom."""
    if plan_of(user) == 'premium':
        return int(getattr(settings, 'PREMIUM_API_MULTIPLIER', 3))
    return 1


def activate_premium(profile, days):
    """Extend Premium by ``days`` from now (or from the current expiry)."""
    now = timezone.now()
    base = max((profile.premium_until or now), now)
    profile.plan = 'premium'
    profile.premium_until = base + timedelta(days=days)
    profile.save(update_fields=['plan', 'premium_until'])
    # Refresh the in-memory profile in case the request object cached it.
    if hasattr(profile.user, '_premium_cached'):
        del profile.user._premium_cached


def revoke_premium(profile):
    profile.plan = 'free'
    profile.premium_until = None
    profile.save(update_fields=['plan', 'premium_until'])


def redeem_code(code_text, user):
    """Apply a promo code; returns (ok: bool, message: str)."""
    from tutorial.models import UserProfile, PromoCode
    from django.db import transaction
    code_text = (code_text or '').strip().upper()
    code = PromoCode.objects.select_for_update().filter(code__iexact=code_text).select_related('used_by').first()
    if code is None:
        return False, 'Такого промокода нет. Проверьте, что вы скопировали его целиком.'
    if code.used_by is not None:
        return False, 'Этот промокод уже использован.'
    if settings.NEED_LOGIN and not user.is_authenticated:
        return False, 'Войдите, чтобы активировать промокод.'
    profile = UserProfile.objects.select_for_update().get(user=user)
    with transaction.atomic():
        code = PromoCode.objects.select_for_update().get(pk=code.pk)
        if code.used_by is not None:
            return False, 'Этот промокод уже использован.'
        activate_premium(profile, code.days)
        code.used_by = user
        code.used_at = timezone.now()
        code.save(update_fields=['used_by', 'used_at'])
    return True, f'Промокод применён: Премиум активен на {code.days} дн.'


class PaymentProvider:
    """Facade for real payment gateways. Subclass per provider."""

    provider = 'test'

    def create_checkout(self, user, plan):
        """Create a checkout session/url in the provider. Returns (url, remote_id)."""
        raise NotImplementedError

    def verify(self, **kwargs):
        """Verifies the callback/notification from the provider."""
        raise NotImplementedError


class TestPaymentProvider(PaymentProvider):
    """No merchant account: an admin generates the promo code and the sale
    is completed by redeeming it. Kept so the rest of the code goes through
    the same interface that a YooKassa/Robokassa backend will use."""

    provider = 'test'

    def describe(self):
        return 'Оплата ещё не подключена. Для активации Премиума обратитесь к администратору за промокодом.'


def get_payment_provider():
    name = getattr(settings, 'PAYMENT_PROVIDER', 'test')
    providers = {'test': TestPaymentProvider}
    return providers.get(name, TestPaymentProvider)()