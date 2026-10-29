from io import StringIO
from pathlib import Path

from django.contrib.auth.models import User
from django.core.management import call_command
from django.test import TestCase
from django.urls import reverse

from tutorial.models import Problem, ProblemInLesson

STATIC_DIR = Path(__file__).resolve().parent / 'static'


def read(*parts):
    return (STATIC_DIR.joinpath(*parts)).read_text(encoding='utf-8')


class EditorWindowTests(TestCase):
    """Окна написания кода: общие настройки подключены везде, где есть редактор."""

    @classmethod
    def setUpTestData(cls):
        call_command('seed_course', stdout=StringIO())
        problem = Problem.objects.get(urlname='aplusbplusc')
        cls.lesson = ProblemInLesson.objects.get(problem=problem).lesson

    def setUp(self):
        self.client.force_login(User.objects.create_user('writer', password='Long-secret-961!'))

    def body(self, url):
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200, url)
        return response.content.decode('utf-8')

    def test_problem_and_lesson_pages_load_editor_setup(self):
        pages = (reverse('problem_in_lesson', args=(self.lesson.urlname, 'aplusbplusc')),
                 reverse('lesson_in_course', args=(self.lesson.urlname,)))
        for url in pages:
            body = self.body(url)
            # Общие настройки должны идти сразу после Ace.
            self.assertIn('js/editor-setup.js', body, url)
            self.assertLess(body.index('js/ace-editor/ace.js'), body.index('js/editor-setup.js'), url)

    def test_image_task_page_loads_editor_setup(self):
        body = self.body(reverse('image_task', args=('grayscale',)))
        self.assertIn('js/editor-setup.js', body)
        self.assertLess(body.index('js/ace-editor/ace.js'), body.index('js/editor-setup.js'))

    def test_editor_setup_module_is_self_contained(self):
        source = read('js', 'editor-setup.js')
        self.assertIn('window.TutorEditor', source)
        self.assertIn('function enhance', source)
        self.assertIn('shiftIndent', source)
        self.assertIn('tutorRunCode', source)
        self.assertIn('Ctrl-Enter', source)
        # Escape отпускает Tab, иначе из редактора нельзя уйти с клавиатуры.
        self.assertIn('escapeArmed', source)

    def test_pages_call_enhance_for_the_code_editor(self):
        for name in ('visualizer.js', 'image-task.js'):
            self.assertIn('TutorEditor.enhance', read('js', name), name)

    def test_editor_styles_live_in_polish_and_theme(self):
        polish = read('css', 'polish.css')
        self.assertIn('.ace_editor', polish)
        self.assertIn('--code-gutter', polish)
        theme = read('css', 'theme.css')
        self.assertIn('--code-gutter', theme)

    def test_assistant_panel_leaves_room_for_the_code(self):
        # Панель ассистента не должна отнимать почти половину ширины окна.
        self.assertIn('var(--tutor-width,34%)', read('css', 'assistant.css'))
        self.assertIn('let split=34;', read('js', 'assistant.js'))
