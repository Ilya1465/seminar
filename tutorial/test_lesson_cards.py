import io

from django.contrib.auth.models import User
from django.core.management import call_command
from django.test import TestCase

from tutorial.lesson_cards import cards_for
from tutorial.lessons import load_lesson
from tutorial.models import Lesson, Problem, Submission
from tutorial.topics import get_topic


class LessonCardsTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command('seed_course', stdout=io.StringIO())

    def unlock_second_topic(self):
        """Тема 2 (ifelse) открывается после полного прохождения темы 1."""
        user = User.objects.create_user('reader')
        for tlesson in get_topic('inout_and_arithmetic_operations')['lessons']:
            for problem in tlesson['problems']:
                Submission.objects.create(user=user, problem=Problem.objects.get(urlname=problem['urlname']), code='', status=1)
        self.client.force_login(user)

    def test_json_cards_for_first_lesson(self):
        lesson = Lesson.objects.get(urlname='inout_and_arithmetic_operations')
        cards = cards_for(lesson)
        types = [card['type'] for card in cards]
        self.assertEqual(len(cards), 10)
        self.assertIn('quiz', types)
        self.assertIn('code', types)
        self.assertEqual(types[-1], 'final')
        quiz = next(card for card in cards if card['type'] == 'quiz')
        self.assertTrue(any(option.get('correct') for option in quiz['options']))
        code = next(card for card in cards if card['type'] == 'code')
        self.assertIn('"stdin"', code['tests_json'])

    def test_auto_cards_for_lesson_without_json(self):
        lesson = Lesson.objects.get(urlname='ifelse')
        cards = cards_for(lesson)
        # Каждая секция и подраздел с текстом — отдельная карточка + финал.
        def count(sections):
            return sum(bool(s.get('text', '').strip()) + count(s.get('subsections', [])) for s in sections)
        expected = count(load_lesson(lesson)['content']) + 1
        self.assertEqual(len(cards), expected)
        self.assertEqual(cards[-1]['type'], 'final')
        self.assertEqual(cards[0]['title'], 'Зачем нужны условия')
        for card in cards[:-1]:
            self.assertEqual(card['type'], 'theory')
            self.assertTrue(card['html'].strip())
            self.assertNotEqual(card['title'], '__text__')

    def test_lesson_page_card_mode_by_default(self):
        response = self.client.get('/lessons/inout_and_arithmetic_operations/')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'lesson-player')
        self.assertContains(response, 'Что выведет')
        self.assertContains(response, 'trial-option')
        self.assertContains(response, 'Читать весь урок целиком')
        self.assertNotContains(response, 'lesson-toc')

    def test_lesson_page_full_view_keeps_old_layout(self):
        response = self.client.get('/lessons/inout_and_arithmetic_operations/?view=full')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'lesson-content')
        self.assertNotContains(response, 'lesson-player')
        # Песочница и задачи есть в обоих режимах
        self.assertContains(response, 'lesson-playground')
        self.assertContains(response, 'id="problems"')

    def test_lesson_page_card_mode_keeps_playground_and_problems(self):
        # В карточном режиме задачи и песочница живут внутри плеера,
        # поэтому отдельных секций на странице нет; в ?view=full они есть.
        self.unlock_second_topic()
        response = self.client.get('/lessons/ifelse/')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'lesson-player')
        self.assertNotContains(response, 'lesson-playground')
        self.assertNotContains(response, 'id="problems"')
        # Задачи попали в карточки плеера.
        self.assertContains(response, 'Задача: Минимум из двух чисел')
        full = self.client.get('/lessons/ifelse/?view=full')
        self.assertContains(full, 'lesson-playground')
        self.assertContains(full, 'id="problems"')

    def test_trial_page_uses_player(self):
        response = self.client.get('/trial/')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'lesson-player')
        self.assertContains(response, 'Пробная версия')
        self.assertContains(response, 'Что выведет')

    def test_lesson_page_hides_badge(self):
        response = self.client.get('/lessons/inout_and_arithmetic_operations/')
        self.assertNotContains(response, 'Пробная версия')
