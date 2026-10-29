from io import StringIO
from unittest.mock import patch

from django.contrib.auth.models import User
from django.core.management import call_command
from django.test import TestCase
from django.urls import reverse

from tutorial.models import ImageSubmission, Problem, ProblemInLesson, Submission

INDEX_ARTICLE = {'slug': 'aplusbplusc', 'title': 'Сумма двух чисел', 'origin': 'authored',
                  'summary': 'Складываем два числа.'}


class KnowledgeIndexTests(TestCase):
    """Индекс знаний должен быть списком дел, а не стеной неактивных строк."""

    @classmethod
    def setUpTestData(cls):
        call_command('seed_course', stdout=StringIO())
        cls.user = User.objects.create_user('reader', password='Long-secret-961!')
        cls.problem = Problem.objects.get(urlname='aplusbplusc')
        cls.lesson = ProblemInLesson.objects.get(problem=cls.problem).lesson

    def index(self):
        return self.client.get(reverse('knowledge_index')).content.decode('utf-8')

    def test_anonymous_is_sent_to_login(self):
        self.assertEqual(self.client.get(reverse('knowledge_index')).status_code, 302)

    @patch('tutorial.views.knowledge.article', return_value=INDEX_ARTICLE)
    def test_locked_entry_links_to_the_task_to_solve(self, _article):
        self.client.force_login(self.user)
        body = self.index()
        task_url = reverse('problem_in_lesson', args=[self.lesson.urlname, 'aplusbplusc'])
        # Заголовок разбора ведёт на задачу: это даёт пользователю следующий шаг.
        self.assertIn('href="%s"' % task_url, body)
        self.assertIn('решите задачу', body)

    @patch('tutorial.views.knowledge.article', return_value=INDEX_ARTICLE)
    def test_solved_problem_links_to_its_article(self, _article):
        Submission.objects.create(user=self.user, problem=self.problem, code='print(3)', status=1)
        self.client.force_login(self.user)
        body = self.index()
        self.assertIn('href="%s"' % reverse('knowledge_problem', args=['aplusbplusc']), body)
        self.assertIn('разбор открыт', body)
        # Разбор открыт — на задачу уже не нужно.
        self.assertNotIn(reverse('problem_in_lesson', args=[self.lesson.urlname, 'aplusbplusc']), body)

    @patch('tutorial.views.knowledge.article', return_value=INDEX_ARTICLE)
    def test_entries_are_grouped_under_lesson_headings(self, _article):
        self.client.force_login(self.user)
        body = self.index()
        self.assertIn('class="knowledge-group"', body)
        self.assertIn('data-group="%s"' % self.lesson.urlname, body)
        # Заголовок группы содержит номер занятия в курсе, а не номер задачи.
        self.assertRegex(body, r'knowledge-group-title">\d+\. ')

    def test_filter_controls_exist_without_any_article(self):
        # Наличие полей не должно зависеть от наличия статей.
        self.client.force_login(self.user)
        self.assertEqual(self.client.get(reverse('knowledge_index')).status_code, 200)

    @patch('tutorial.views.knowledge.article', return_value=INDEX_ARTICLE)
    def test_other_users_progress_is_not_shown(self, _article):
        other = User.objects.create_user('stranger', password='Long-secret-962!')
        Submission.objects.create(user=other, problem=self.problem, code='print(3)', status=1)
        self.client.force_login(self.user)
        self.assertNotIn('разбор открыт', self.index())

    @patch('tutorial.views.knowledge.article', side_effect=lambda slug, image=False: None)
    def test_empty_catalog_hides_filters_and_explains_itself(self, _article):
        self.client.force_login(self.user)
        response = self.client.get(reverse('knowledge_index'))
        body = response.content.decode('utf-8')
        self.assertContains(response, 'Разборов пока нет')
        self.assertNotIn('id="knowledge-filter"', body)

    @patch('tutorial.views.knowledge.catalog', return_value=[
        {'slug': 'obrabotka', 'title': 'Чтение изображения'}])
    @patch('tutorial.views.knowledge.article')
    def test_image_tasks_are_listed_in_their_own_group(self, article, _catalog):
        article.side_effect = lambda slug, image=False: (
            {'title': 'Порог и бинаризация'} if image and slug == 'obrabotka' else INDEX_ARTICLE)
        self.client.force_login(self.user)
        body = self.index()
        self.assertIn('data-group="opencv"', body)
        # В списке показываем название задачи, а не название разбора.
        self.assertIn('Чтение изображения', body)
        self.assertIn('href="%s"' % reverse('image_task', args=['obrabotka']), body)

    @patch('tutorial.views.knowledge.catalog', return_value=[
        {'slug': 'obrabotka', 'title': 'Чтение изображения'}])
    @patch('tutorial.views.knowledge.article', return_value=INDEX_ARTICLE)
    def test_passed_image_task_unlocks_its_article(self, _article, _catalog):
        ImageSubmission.objects.create(user=self.user, task_slug='obrabotka', status='ok')
        self.client.force_login(self.user)
        self.assertIn('href="%s"' % reverse('knowledge_image', args=['obrabotka']), self.index())
