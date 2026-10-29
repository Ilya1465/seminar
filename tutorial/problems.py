from functools import lru_cache
from django import template
from django.conf import settings


ABSOLUTE_PATH_TO_PROBLEMS = settings.ABSOLUTE_PREFIX + 'problems/'


def get_sorted_problems(lesson):
    problems = [load_problem(problem) for problem in lesson.problems.all()]
    orders = {pid: order for pid, order in
              (row for row in lesson.probleminlesson_set.values_list('problem_id', 'order'))}
    for problem in problems:
        problem['order'] = orders.get(problem['db_object'].pk, 0)
        problem['statuses'] = []
    problems.sort(key=lambda problem: problem['order'])
    return problems


def set_statuses(user, problems):
    """Attach display statuses to problem dicts with a single query instead of one per problem."""
    if not user.is_authenticated:
        return
    from collections import defaultdict
    from django.contrib.auth.models import AnonymousUser
    from tutorial.models import Submission
    ids = [problem['db_object'].pk for problem in problems]
    statuses = defaultdict(set)
    for submission in Submission.objects.filter(user=user, problem_id__in=ids).only('problem_id', 'status'):
        statuses[submission.problem_id].add(submission.get_status_display())
    for problem in problems:
        problem['statuses'] = list(statuses[problem['db_object'].pk])


@lru_cache(maxsize=600)
def parse_file(filename):
    ret = {}
    ret['tests'] = []
    ret['answers'] = []

    curParts = []
    curDelimiter = None

    def processRecord():
        if curDelimiter == 'Name:':
            ret['name'] = '\n'.join(curParts).strip()
        elif curDelimiter == 'Statement:':
            ret['statement'] = ' '.join(curParts).strip()
        elif curDelimiter == 'Test:':
            ret['tests'].append('\n'.join(curParts).strip())
        elif curDelimiter == 'Answer:':
            ret['answers'].append('\n'.join(curParts).strip())


    for line in open(filename, 'r', encoding='utf-8'):
        # only strip TRAILING spaces and not leading spaces
        line = line.rstrip()

        # comments are denoted by a leading '//', so ignore those lines.
        # Note that I don't use '#' as the comment token since sometimes I
        # want to include Python comments in the skeleton code.
        if line.startswith('//'):
            continue

        # special-case one-liners:
        if line.startswith('MaxInstructions:'):
            ret['max_instructions'] = int(line.split(':')[1])
            continue # move to next line


        if line in ('Name:', 'Statement:', 'Test:', 'Answer:'):
            processRecord()
            curDelimiter = line
            curParts = []
        else:
            curParts.append(line)

    # don't forget to process the FINAL record
    processRecord()

    assert len(ret['tests']) == len(ret['answers'])

    return ret


def load_problem(problem):
    ret = parse_file(ABSOLUTE_PATH_TO_PROBLEMS + problem.filename)

    ret['urlname'] = problem.urlname
    ret['filename'] = problem.filename
    ret['db_object'] = problem

    return ret


def load_raw_problem(problem):
    ret = load_problem(problem)
    del ret['db_object']
    return ret
