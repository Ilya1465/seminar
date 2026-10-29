from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_POST

from tutorial.coins import open_chests


@login_required
@require_POST
def chests_open(request):
    reward, new_balance = open_chests(request.user)
    return JsonResponse({'reward': reward, 'balance': new_balance})
