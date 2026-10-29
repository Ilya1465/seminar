import io

from django.contrib.auth.models import User
from django.core.management import call_command
from django.test import TestCase

from tutorial.models import Problem, Submission
from tutorial.topics import all_topics, get_topic


class TopicsTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command('seed_course', stdout=io.StringIO())

    def unlock_all(self):
        """Решаем все задачи курса — все темы и уроки открыты."""
        user = User.objects.create_user('master')
        for problem in Problem.objects.all():
            Submission.objects.create(user=user, problem=problem, code='', status=1)
        self.client.force_login(user)

    def test_registry_has_at_least_50_topics_with_5_lessons_each(self):
        topics = all_topics()
        self.assertGreaterEqual(len(topics), 50)
        for topic in topics:
            self.assertGreaterEqual(len(topic['lessons']), 5, topic['slug'])
            for tlesson in topic['lessons']:
                self.assertTrue(tlesson['theory_html'].strip() or tlesson['problems'] or tlesson.get('cards'),
                                '%s / %s' % (topic['slug'], tlesson['title']))

    def test_topics_index_lists_all_topics(self):
        response = self.client.get('/topics/')
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.context['topic_states']), 50)
        self.assertContains(response, 'Строки')

    def test_topic_page_lists_its_lessons(self):
        topic = get_topic('ifelse')
        self.assertIsNotNone(topic)
        response = self.client.get('/topics/ifelse/')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Урок 1')

    def test_topic_lesson_page_has_player(self):
        self.unlock_all()
        response = self.client.get('/topics/ifelse/1/')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'lesson-player')
        self.assertContains(response, 'trial-card')

    def test_unknown_topic_and_lesson_404(self):
        self.unlock_all()
        self.assertEqual(self.client.get('/topics/nope/').status_code, 404)
        self.assertEqual(self.client.get('/topics/ifelse/999/').status_code, 404)

    def test_every_lesson_has_at_least_10_steps(self):
        from tutorial.topic_cards import cards_for_topic_lesson
        for topic in all_topics():
            topic_problems = [p for item in topic['lessons'] for p in item['problems']]
            for tlesson in topic['lessons']:
                cards = cards_for_topic_lesson(tlesson, topic_problems)
                types = [c['type'] for c in cards]
                if tlesson['problems']:
                    self.assertGreaterEqual(len(cards), 10, '%s / %s' % (topic['slug'], tlesson['title']))
                else:
                    # Чистая теория: никаких заданий, пока тема не объяснена.
                    self.assertNotIn('code', types, '%s / %s' % (topic['slug'], tlesson['title']))
                    self.assertNotIn('quiz', types, '%s / %s' % (topic['slug'], tlesson['title']))
                self.assertEqual(cards[-1]['type'], 'final')

    def test_practice_topic_lesson_runs_problems(self):
        topic = get_topic('practice-ifelse-6')
        self.assertIsNotNone(topic)
        with_problem = [t for t in topic['lessons'] if t['problems']]
        self.assertTrue(with_problem)
        self.unlock_all()
        response = self.client.get('/topics/%s/2/' % topic['slug'])
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'lesson-player')
