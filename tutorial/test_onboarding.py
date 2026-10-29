import io

from django.contrib.auth.models import User
from django.core.management import call_command
from django.test import Client, TestCase

from tutorial.models import UserProfile


class OnboardingTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command('seed_course', stdout=io.StringIO())
        cls.user = User.objects.create_user('learner')

    def setUp(self):
        self.client.force_login(self.user)

    def level(self):
        return UserProfile.objects.get(user=self.user).level

    def test_survey_get(self):
        self.assertEqual(self.client.get('/onboarding/').status_code, 200)

    def test_survey_post_sets_level_and_redirects_to_plan(self):
        for choice, expected in [('beginner', 1), ('basics', 2), ('confident', 3)]:
            user = User.objects.create_user(f'user_{choice}')
            self.client.force_login(user)
            response = self.client.post('/onboarding/', {'choice': choice})
            self.assertRedirects(response, '/plan/', fetch_redirect_response=False)
            self.assertEqual(UserProfile.objects.get(user=user).level, expected)

    def test_survey_invalid_choice_keeps_level_zero(self):
        response = self.client.post('/onboarding/', {'choice': 'guru'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.level(), 0)

    def test_plan_gates(self):
        self.assertEqual(Client().get('/plan/').status_code, 302)
        self.assertRedirects(self.client.get('/plan/'), '/onboarding/', fetch_redirect_response=False)
        # Онбординг пройден — редирект на программу
        profile = self.user.userprofile
        profile.level = 2
        profile.save(update_fields=['level'])
        self.assertRedirects(self.client.get('/onboarding/'), '/plan/', fetch_redirect_response=False)

    def test_plan_level2_starts_from_strings(self):
        from tutorial.topics import all_topics
        expected = next(i for i, t in enumerate(all_topics()) if t['slug'] == 'str') + 1
        profile = self.user.userprofile
        profile.level = 2
        profile.save(update_fields=['level'])
        response = self.client.get('/plan/')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Знаю основы')
        self.assertContains(response, 'Строки')
        self.assertContains(response, '/topics/str/')
        topics = response.context['topics']
        self.assertEqual(topics[0]['order'], expected)
        self.assertEqual(topics[0]['topic']['slug'], 'str')
        self.assertNotIn('inout_and_arithmetic_operations', [item['topic']['slug'] for item in topics])

    def test_plan_level3_contains_functions(self):
        from tutorial.topics import all_topics
        expected = next(i for i, t in enumerate(all_topics()) if t['slug'] == 'functions') + 1
        profile = self.user.userprofile
        profile.level = 3
        profile.save(update_fields=['level'])
        response = self.client.get('/plan/')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Функции')
        self.assertContains(response, '/topics/functions/')
        topics = response.context['topics']
        self.assertEqual(topics[0]['order'], expected)
        self.assertEqual(topics[0]['topic']['slug'], 'functions')
        self.assertNotIn('str', [item['topic']['slug'] for item in topics])

    def test_plan_level1_has_whole_course(self):
        profile = self.user.userprofile
        profile.level = 1
        profile.save(update_fields=['level'])
        response = self.client.get('/plan/')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, '/topics/inout_and_arithmetic_operations/')
        self.assertContains(response, 'Учиться по курсу')

    def test_register_redirects_to_onboarding(self):
        self.client.logout()
        response = self.client.post('/accounts/register/', {'username': 'fresh', 'email': 'fresh@example.org', 'password': 'Good-secret!934', 'confirm_password': 'Good-secret!934'})
        self.assertRedirects(response, '/onboarding/', fetch_redirect_response=False)
        self.assertEqual(self.client.get('/onboarding/').status_code, 200)

    def test_home_has_no_lesson_cards(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertNotContains(response, 'lesson-card')
