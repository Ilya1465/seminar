# -*- coding: utf-8 -*-
"""Tariff / subscription page: shows the plan, the differences and lets a
user redeem a promo code or request a real payment once a gateway is wired up."""
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.conf import settings
from tutorial.billing import PLANS, plan_of, ai_daily_limit, ai_daily_limits, get_payment_provider, redeem_code


@login_required
def tariff(request):
    profile = request.user.userprofile
    key = plan_of(request.user)
    provider = get_payment_provider()
    if request.method == 'POST':
        ok, message = redeem_code(request.POST.get('code', ''), request.user)
        (messages.success if ok else messages.error)(request, message)
        return redirect('tariff')
    plans = {
        name: {
            'title': data['title'],
            'price': 0 if name == 'free' else getattr(settings, 'PREMIUM_PRICE', 299),
            'ai_daily_limit': limits[name],
        }
        for name, data in PLANS.items()
        for limits in (ai_daily_limits(),)
    }
    return render(request, 'tariff.html', {
        'plans': plans,
        'current': key,
        'premium_until': profile.premium_until if profile.effective_plan == 'premium' else None,
        'ai_limit': ai_daily_limit(request.user),
        'provider': provider,
        'provider_note': provider.describe() if hasattr(provider, 'describe') else '',
    })