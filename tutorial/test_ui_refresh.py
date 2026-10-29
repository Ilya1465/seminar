"""Проверки site-wide обновления: единая шкала оформления, заголовки h1,
доступность ссылок и фокуса, а также 404 вместо 500 для служебных страниц.
"""
import re
from io import StringIO

from django.contrib.auth.models import User
from django.core.management import call_command
from django.test import TestCase

from tutorial.models import Course, Lesson, Problem, ProblemInLesson


def _src(path):
    import os
    import pythontutor
    base = os.path.dirname(os.path.dirname(os.path.abspath(pythontutor.__file__)))
    with open(os.path.join(base, path), encoding='utf-8') as fh:
        return fh.read()


class DesignTokenTests(TestCase):
    """ui.css обязан опираться на токены, а не на новые числа с потолка."""

    def test_ui_css_linked_in_base_template(self):
        self.assertIn('css/ui.css', _src('tutorial/templates/_base.html'))

    def test_ui_css_loaded_after_polish(self):
        base = _src('tutorial/templates/_base.html')
        self.assertLess(base.index('polish.css'), base.index('ui.css'))

    def test_spacing_and_type_tokens_exist_in_both_themes(self):
        theme = _src('tutorial/static/css/theme.css')
        root = theme.split('html[data-theme="dark"]')[0]
        dark = theme.split('html[data-theme="dark"]')[1]
        for token in ('--space-1:', '--space-6:', '--radius:', '--radius-lg:',
                      '--shadow-sm:', '--fs-base:', '--fs-2xl:', '--fs-3xl:'):
            self.assertIn(token, root, token)
        for token in ('--surface:', '--shadow-md:', '--focus-ring:'):
            self.assertIn(token, dark, token)

    def test_typography_scale_is_monotonic(self):
        """Заголовки должны расти сверху вниз: h3 больше основного текста."""
        ui = _src('tutorial/static/css/ui.css')
        theme = _src('tutorial/static/css/theme.css')
        sizes = {}
        for name in ('base', 'md', 'lg', 'xl', '2xl', '3xl'):
            match = re.search(r'--fs-' + re.escape(name) + r':\s*([\d.]+)rem', theme)
            self.assertIsNotNone(match, name)
            sizes[name] = float(match.group(1))
        ordered = [sizes['base'], sizes['md'], sizes['lg'], sizes['xl'], sizes['2xl'], sizes['3xl']]
        self.assertEqual(ordered, sorted(ordered))
        # Ни один заголовок не должен быть мельче основного текста.
        self.assertGreater(sizes['2xl'], sizes['base'])

    def test_headings_use_tokens(self):
        ui = _src('tutorial/static/css/ui.css')
        for tag, token in (('h1', '--fs-2xl'), ('h2', '--fs-xl'),
                           ('h3', '--fs-lg'), ('h4', '--fs-md')):
            self.assertRegex(ui, re.escape(tag) + r'\s*\{[^}]*' + re.escape(token))


class AccessibilityTests(TestCase):
    """Для страниц с курсом нужна seeded-база, поэтому поднимаем её один раз."""

    @classmethod
    def setUpTestData(cls):
        call_command('seed_course', stdout=StringIO())
        problem = Problem.objects.get(urlname='aplusbplusc')
        cls.lesson = ProblemInLesson.objects.get(problem=problem).lesson

    def setUp(self):
        self.user = User.objects.create_user('a11y_user', password='secret12345')

    def test_in_content_links_are_underlined(self):
        ui = _src('tutorial/static/css/ui.css')
        block = ui.split('/* ---------- Доступность')[1].split('/* ----------')[0]
        self.assertIn('text-decoration: underline', block)

    def test_buttons_have_focus_ring(self):
        ui = _src('tutorial/static/css/ui.css')
        self.assertRegex(ui, r'\.btn:focus-visible\s*\{[^}]*outline: 2px solid')
        # Bootstrap сам по себе фокус на .btn не рисует.
        self.assertNotIn('.btn:focus {\n\toutline: none', _src('tutorial/static/css/ui.css'))

    def test_muted_text_contrast_improved(self):
        """--text-muted был #777 (4.2:1), теперь должен быть темнее."""
        theme = _src('tutorial/static/css/theme.css')
        self.assertNotIn('--text-muted: #777777', theme)

    def test_every_page_has_exactly_one_h1(self):
        pages = [
            '/',
            '/knowledge/',
            '/visualizer/',
            '/accounts/login/',
            '/lessons/%s/' % self.lesson.urlname,
            '/lessons/%s/problems/aplusbplusc/' % self.lesson.urlname,
        ]
        self.client.force_login(self.user)
        for path in pages:
            with self.subTest(path=path):
                response = self.client.get(path)
                self.assertEqual(response.status_code, 200, path)
                self.assertEqual(response.content.decode('utf-8').count('<h1'), 1, path)

    def test_statistics_page_has_one_h1(self):
        staff = User.objects.create_user('a11y_stats', password='secret12345', is_staff=True)
        self.client.force_login(staff)
        body = self.client.get('/statistics/').content.decode('utf-8')
        self.assertEqual(body.count('<h1'), 1)

    def test_login_page_heading_is_h1(self):
        self.assertEqual(self.client.get('/accounts/login/').content.decode('utf-8').count('<h1'), 1)


class StaffPageTests(TestCase):
    def setUp(self):
        self.staff = User.objects.create_user('ui_staff', password='secret12345', is_staff=True)
        self.course = Course.objects.first()

    def test_standings_bad_slug_returns_404(self):
        self.client.force_login(self.staff)
        response = self.client.get('/standings/no-such-course/')
        self.assertEqual(response.status_code, 404)

    def test_standings_good_slug_renders(self):
        if self.course is None:
            self.skipTest('нет курса в базе')
        self.client.force_login(self.staff)
        self.assertEqual(self.client.get('/standings/%s/' % self.course.urlname).status_code, 200)

    def test_success_roadmap_non_numeric_returns_404(self):
        self.client.force_login(self.staff)
        self.assertEqual(self.client.get('/success_roadmap/abc/').status_code, 404)

    def test_success_roadmap_unknown_id_returns_404(self):
        self.client.force_login(self.staff)
        self.assertEqual(self.client.get('/success_roadmap/99999999/').status_code, 404)


class HomePageTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command('seed_course', stdout=StringIO())

    def test_hero_is_h1_with_primary_action(self):
        body = self.client.get('/').content.decode('utf-8')
        self.assertIn('<h1', body)
        self.assertIn('home-title-actions', body)

    def test_video_is_responsive(self):
        """Раньше видео было фиксированной шириной 600px и вылезало на телефоне."""
        ui = _src('tutorial/static/css/ui.css')
        block = ui.split('.home-video video')[1].split('}')[0]
        self.assertIn('max-width: 100%', block)
        self.assertIn('aspect-ratio', block)
        self.assertNotIn('width: 600px', ui)

    def test_home_sections_share_page_grid(self):
        ui = _src('tutorial/static/css/ui.css')
        self.assertIn('max-width: var(--page-max)', ui)