from io import StringIO

from django.core.management import call_command
from django.test import Client, RequestFactory, TestCase, override_settings

from pythontutor.urls import error_403, error_404, error_500


def boom(request):
    raise RuntimeError('намеренная ошибка для проверки страницы 500')


urlpatterns = [
    ('boom/', boom),
]

handler403 = error_403
handler404 = error_404
handler500 = error_500


class ErrorPageTests(TestCase):
    """Страницы ошибок должны открываться без базы, статики и навигации."""

    def test_missing_url_renders_localized_404(self):
        response = self.client.get('/no-such-page/')
        self.assertEqual(response.status_code, 404)
        body = response.content.decode('utf-8')
        self.assertIn('Ошибка 404', body)
        self.assertIn('lang="ru"', body)
        # Своя страница вместо технической заглушки Django.
        self.assertNotIn('The requested resource was not found', body)
        self.assertIn('noindex', body)

    def test_404_offers_working_navigation_targets(self):
        call_command('seed_course', stdout=StringIO())
        body = self.client.get('/no-such-page/').content.decode('utf-8')
        for path in ('href="/"', 'href="/knowledge/"', 'href="/accounts/login/"'):
            self.assertIn(path, body)
        # Ссылки со страницы ошибки должны доводить до страницы, а не к ошибке.
        for path in ('/', '/knowledge/', '/accounts/login/'):
            self.assertIn(self.client.get(path).status_code, (200, 302))

    def test_error_pages_do_not_depend_on_database(self):
        # Пустая тестовая база: если бы шаблон что-то запрашивал, тест бы упал.
        for view, status in ((error_404, 404), (error_500, 500), (error_403, 403)):
            response = view(RequestFactory().get('/whatever/'))
            self.assertEqual(response.status_code, status)
            self.assertIn('Ошибка', response.content.decode('utf-8'))

    def test_500_page_avoids_url_reverse(self):
        # Обратное преобразование может сломаться при падении сервера.
        body = error_500(RequestFactory().get('/whatever/')).content.decode('utf-8')
        self.assertNotIn('{%', body)
        self.assertIn('Ошибка 500', body)

    @override_settings(ROOT_URLCONF='tutorial.test_errors')
    def test_unhandled_exception_shows_our_500_page(self):
        response = Client(raise_request_exception=False).get('/boom/')
        self.assertEqual(response.status_code, 500)
        self.assertIn('Ошибка 500', response.content.decode('utf-8'))
