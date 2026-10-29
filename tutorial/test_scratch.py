import io

from django.core.management import call_command
from django.test import TestCase

from tutorial.scratch_levels import LEVELS, get_level


class ScratchStudioTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command('seed_course', stdout=io.StringIO())

    def test_index_lists_all_levels(self):
        response = self.client.get('/scratch/')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Мир героя')
        self.assertContains(response, 'Первый шаг')

    def test_level_page_has_field_and_blocks(self):
        response = self.client.get('/scratch/first-step/')
        self.assertEqual(response.status_code, 200)
        body = response.content.decode()
        self.assertIn('studio-field', body)
        self.assertIn('studio-palette', body)
        self.assertIn('scratchblocks', body)
        self.assertIn('scratch-studio.js', body)
        self.assertIn('SCRATCH_LEVEL', body)

    def test_unknown_level_404(self):
        self.assertEqual(self.client.get('/scratch/nope/').status_code, 404)

    def test_levels_are_well_formed(self):
        for level in LEVELS:
            grid = level['grid']
            width = len(grid[0])
            self.assertTrue(all(len(row) == width for row in grid), level['slug'])
            self.assertIn('G', ''.join(grid), level['slug'])
            self.assertTrue(level['blocks'], level['slug'])
            self.assertIsNotNone(get_level(level['slug']))
