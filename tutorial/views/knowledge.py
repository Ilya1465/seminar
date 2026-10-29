from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, render
from django.http import Http404
from django.urls import reverse
from django.views.decorators.cache import never_cache
from tutorial.models import Problem, Submission, ImageSubmission, ProblemInLesson, LessonInCourse
from tutorial.knowledge import article, solved
from tutorial.image_course import catalog
from tutorial.views import DEFAULT_COURSE


@login_required
@never_cache
def knowledge_index(request):
    passed = set(Submission.objects.filter(user=request.user, status__in=[1, 2]).values_list('problem_id', flat=True))
    images_passed = set(ImageSubmission.objects.filter(user=request.user, status='ok').values_list('task_slug', flat=True))

    # Первое место, где встречается задача: нужно, чтобы у заблокированной
    # статьи была ссылка на саму задачу. Один запрос вместо запроса на каждую.
    first_relation = {}
    for relation in (ProblemInLesson.objects.select_related('lesson')
                     .order_by('lesson__lessonincourse__order', 'order')):
        first_relation.setdefault(relation.problem_id, relation)

    # Номер занятия в курсе нужен для заголовка группы.
    lesson_numbers = dict(
        LessonInCourse.objects.filter(course__urlname=DEFAULT_COURSE)
        .values_list('lesson__urlname', 'order'))

    groups = []
    current = None
    loose = []
    for problem in Problem.objects.order_by('probleminlesson__lesson__lessonincourse__order', 'probleminlesson__order'):
        data = article(problem.urlname)
        if not data:
            continue
        relation = first_relation.get(problem.pk)
        lesson = relation.lesson if relation else None
        task_url = (reverse('problem_in_lesson', args=[lesson.urlname, problem.urlname])
                    if lesson else reverse('home'))
        item = {
            'title': data['title'],
            'unlocked': problem.pk in passed,
            'url': reverse('knowledge_problem', args=[problem.urlname]),
            'task_url': task_url,
        }
        if lesson is None:
            loose.append(item)
            continue
        if current is None or current['key'] != lesson.urlname:
            number = lesson_numbers.get(lesson.urlname)
            title = '%d. %s' % (number, lesson.title) if number else lesson.title
            current = {'key': lesson.urlname, 'title': title, 'entries': []}
            groups.append(current)
        current['entries'].append(item)

    if loose:
        groups.append({'key': 'other', 'title': 'Без занятия', 'entries': loose})

    image_entries = []
    for task in catalog():
        if article(task['slug'], image=True):
            image_entries.append({
                'title': task['title'],
                'unlocked': task['slug'] in images_passed,
                'url': reverse('knowledge_image', args=[task['slug']]),
                'task_url': reverse('image_task', args=[task['slug']]),
            })
    if image_entries:
        groups.append({'key': 'opencv', 'title': 'OpenCV', 'entries': image_entries})

    entries = [item for group in groups for item in group['entries']]
    return render(request, 'knowledge_index.html', {
        'groups': groups,
        'entries': entries,
        'unlocked_count': sum(e['unlocked'] for e in entries),
    })


@login_required
@never_cache
def knowledge_problem(request, slug):
    problem = get_object_or_404(Problem, urlname=slug)
    relation = problem.probleminlesson_set.select_related('lesson').first()
    task_url = reverse('problem_in_lesson', args=[relation.lesson.urlname, slug]) if relation else reverse('home')
    if not solved(request.user, problem=problem):
        return render(request, 'knowledge_locked.html', {'task_url': task_url}, status=403)
    data = article(slug)
    if data is None:
        raise Http404('Разбор ещё не опубликован')
    own = Submission.objects.filter(user=request.user, problem=problem, status__in=[1, 2]).latest('time')
    return render(request, 'knowledge_article.html', {'article': data, 'task_url': task_url, 'own_code': own.code})


@login_required
@never_cache
def knowledge_image(request, slug):
    task = next((t for t in catalog() if t['slug'] == slug), None)
    if task is None:
        raise Http404
    task_url = reverse('image_task', args=[slug])
    if not solved(request.user, image_slug=slug):
        return render(request, 'knowledge_locked.html', {'task_url': task_url}, status=403)
    data = article(slug, image=True)
    if data is None:
        raise Http404
    own = ImageSubmission.objects.filter(user=request.user, task_slug=slug, status='ok').latest('time')
    return render(request, 'knowledge_article.html', {'article': data, 'task_url': task_url, 'own_code': own.code})
