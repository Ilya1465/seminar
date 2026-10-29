import io

from django.contrib.auth.models import User
from django.core.management import call_command
from django.test import TestCase

from tutorial.coins import CHEST_REWARDS, LESSON_REWARD, REGISTER_REWARD, balance, on_problem_solved
from tutorial.models import Chest, CoinTransaction, Problem, Submission
from tutorial.topics import get_topic


class CoinsTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command('seed_course', stdout=io.StringIO())
        cls.user = User.objects.create_user('rich')

    def solve(self, *urlnames):
        for urlname in urlnames:
            Submission.objects.create(user=self.user, problem=Problem.objects.get(urlname=urlname), code='', status=1)
            on_problem_solved(self.user, urlname)

    def test_register_bonus(self):
        response = self.client.post('/accounts/register/', {'username': 'newbie', 'password': 'Good-secret!934', 'confirm_password': 'Good-secret!934'})
        self.assertEqual(response.status_code, 302)
        self.assertEqual(balance(User.objects.get(username='newbie')), REGISTER_REWARD)

    def test_lesson_completion_awards_coins_once(self):
        topic = get_topic('inout_and_arithmetic_operations')
        # Первый урок с задачами (вводные уроки — без заданий и наград).
        first_lesson = next(l for l in topic['lessons'] if l['problems'])
        self.solve(*[p['urlname'] for p in first_lesson['problems']])
        self.assertEqual(balance(self.user), LESSON_REWARD)
        # Повторное прохождение не начисляет второй раз.
        self.solve(*[p['urlname'] for p in first_lesson['problems']])
        self.assertEqual(balance(self.user), LESSON_REWARD)

    def test_topic_completion_gives_chest_and_opening_pays(self):
        topic = get_topic('inout_and_arithmetic_operations')
        for tlesson in topic['lessons']:
            self.solve(*[p['urlname'] for p in tlesson['problems']])
        chest = Chest.objects.get(user=self.user, topic=topic['slug'])
        self.assertFalse(chest.opened)
        self.assertIn(chest.reward, CHEST_REWARDS)
        self.client.force_login(self.user)
        before = balance(self.user)
        # Открываются все накопленные сундуки (основная тема + практики).
        expected = sum(c.reward for c in Chest.objects.filter(user=self.user, opened=False))
        response = self.client.post('/coins/chests/open/')
        data = response.json()
        self.assertEqual(data['reward'], expected)
        self.assertEqual(data['balance'], before + expected)
        # Второй раз открыть нельзя.
        self.assertEqual(self.client.post('/coins/chests/open/').json()['reward'], 0)

    def test_open_chests_requires_login(self):
        self.assertEqual(self.client.post('/coins/chests/open/').status_code, 302)
