from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render

CHOICES = {
    'beginner': 1,
    'basics': 2,
    'confident': 3,
}


@login_required
def onboarding(request):
    profile = request.user.userprofile
    if profile.level != 0:
        return redirect('plan')
    if request.method == 'POST':
        level = CHOICES.get(request.POST.get('choice', ''))
        if level is None:
            return render(request, 'onboarding.html', {'error': True})
        profile.level = level
        profile.save(update_fields=['level'])
        return redirect('plan')
    return render(request, 'onboarding.html')
