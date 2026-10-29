import io

from django.contrib.auth.models import User
from django.core.management import call_command
from django.test import TestCase

from tutorial.access import lesson_states, solved_urlnames, topic_states
from tutorial.models import Problem, Submission
from tutorial.topics import all_topics, get_topic


class AccessLockTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command('seed_course', stdout=io.StringIO())
        cls.user = User.objects.create_user('learner')

    def solve(self, *urlnames):
        for urlname in urlnames:
            Submission.objects.create(user=self.user, problem=Problem.objects.get(urlname=urlname), code='', status=1)

    def test_anonymous_has_only_first_lesson_of_first_topic(self):
        self.assertEqual(self.client.get('/topics/').status_code, 200)
        self.assertEqual(self.client.get('/topics/inout_and_arithmetic_operations/1/').status_code, 200)
        # Вторая тема под замком; первый урок с задачами (вводные уроки — чистая
        # теория и открываются чтением) — тоже.
        self.assertEqual(self.client.get('/topics/ifelse/1/').status_code, 423)
        topic = get_topic('inout_and_arithmetic_operations')
        first_with_tasks = next(i for i, l in enumerate(topic['lessons'], 1) if l['problems'])
        self.assertEqual(self.client.get('/topics/inout_and_arithmetic_operations/%d/' % (first_with_tasks + 1)).status_code, 423)
        self.assertContains(self.client.get('/topics/'), 'is-locked')

    def test_lesson_unlocks_after_previous_lesson_solved(self):
        self.client.force_login(self.user)
        topic = get_topic('inout_and_arithmetic_operations')
        # Первый урок с задачами: пока он не решён, следующий закрыт.
        index = next(i for i, l in enumerate(topic['lessons'], 1) if l['problems'])
        self.assertEqual(self.client.get('/topics/inout_and_arithmetic_operations/%d/' % (index + 1)).status_code, 423)
        self.solve(*[p['urlname'] for p in topic['lessons'][index - 1]['problems']])
        self.assertEqual(self.client.get('/topics/inout_and_arithmetic_operations/%d/' % (index + 1)).status_code, 200)
        # А урок через один всё ещё закрыт.
        self.assertEqual(self.client.get('/topics/inout_and_arithmetic_operations/%d/' % (index + 2)).status_code, 423)

    def test_next_topic_unlocks_after_topic_completed(self):
        self.client.force_login(self.user)
        topic = get_topic('inout_and_arithmetic_operations')
        for tlesson in topic['lessons']:
            self.solve(*[p['urlname'] for p in tlesson['problems']])
        self.assertEqual(self.client.get('/topics/ifelse/1/').status_code, 200)
        # А третья тема по-прежнему закрыта.
        self.assertEqual(self.client.get('/topics/int_and_float/1/').status_code, 423)

    def test_locked_main_lesson_page(self):
        self.client.force_login(self.user)
        self.assertEqual(self.client.get('/lessons/ifelse/').status_code, 423)
        topic = get_topic('inout_and_arithmetic_operations')
        for tlesson in topic['lessons']:
            self.solve(*[p['urlname'] for p in tlesson['problems']])
        self.assertEqual(self.client.get('/lessons/ifelse/').status_code, 200)

    def test_states_helpers(self):
        solved = solved_urlnames(self.user)
        self.assertEqual(solved, frozenset())
        topics = all_topics()
        # Модуль 1 (Scratch) свободен; строгая цепочка — в модуле 2 (Python).
        scratch = topic_states([t for t in topics if t['module'] == 1], solved)
        self.assertTrue(all(unlocked for _, unlocked in scratch))
        python = [t for t in topics if t['module'] == 2]
        states = topic_states(python[:3], solved)
        self.assertEqual([unlocked for _, unlocked in states], [True, False, False])
