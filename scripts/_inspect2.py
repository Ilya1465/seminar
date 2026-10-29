import os, django
from tutorial.models import Problem, ProblemInLesson

p = Problem.objects.get(urlname='lineup')
print('lineup filename:', p.filename)
print('lineup lessons:', list(ProblemInLesson.objects.filter(problem=p).values_list('lesson__urlname', flat=True)))
q = Problem.objects.get(urlname='lists_queens')
print('lists_queens filename:', q.filename)
print('lists_queens lessons:', list(ProblemInLesson.objects.filter(problem=q).values_list('lesson__urlname', flat=True)))