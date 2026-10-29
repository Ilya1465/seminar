from django.conf import settings


def execution(request):
    data = {'execution_mode': settings.EXECUTION_MODE, 'pwa_offline': getattr(request, 'pwa_offline', False)}
    # Страницы ошибок рендерятся без middleware и, возможно, без базы.
    user = getattr(request, 'user', None)
    if user is not None and user.is_authenticated:
        try:
            from tutorial.coins import balance
            data['coin_balance'] = balance(user)
        except Exception:
            data['coin_balance'] = 0
    return data
