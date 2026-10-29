# -*- coding: utf-8 -*-

import re
import urllib.request, urllib.parse, urllib.error

from django.contrib.auth.models import User
from django.conf import settings
from django.template import Context, Library, Node, Template, TemplateSyntaxError
from django.template.loader import get_template
from django.utils.safestring import mark_safe

from tutorial.models import Problem, Submission
from tutorial.problems import load_problem


register = Library()



LESSON_IMG_ROOT = '/static/images/lesson_images/'


def _render_code_to_html(**kwargs):
    return get_template('code.html').render(kwargs)


class ProgramCodeNode(Node):
    def __init__(self, nodelist, executable=True, dataviz=True):
        self.nodelist = nodelist
        self.executable = executable
        self.dataviz = dataviz

    def render(self, context):
        context['input_data'] = ''
        code = self.nodelist.render(context).strip()
        input_data = context.get('input_data', '')

        return _render_code_to_html(**{
			'code': code,
            'input_data': input_data,
            'executable': self.executable,
            'dataviz': self.dataviz,
		})


@register.tag('program')
def highlight_program_code(parser, token):
    nodelist = parser.parse(('endprogram',))
    parser.delete_first_token()
    return ProgramCodeNode(nodelist, executable=True)


@register.tag('noprogram')
def highlight_program_code(parser, token):
    nodelist = parser.parse(('endnoprogram',))
    parser.delete_first_token()
    return ProgramCodeNode(nodelist, executable=False)


class InputDataNode(Node):
    def __init__(self, nodelist):
        self.nodelist = nodelist

    def render(self, context):
        input_data = self.nodelist.render(context).strip()
        context['input_data'] = input_data
        return ''


@register.tag('inputdata')
def add_input_data(parser, token):
    nodelist = parser.parse(('endinputdata',))
    parser.delete_first_token()
    return InputDataNode(nodelist)


class LessonNode(Node):
    def __init__(self, nodelist):
        self.nodelist = nodelist

    def render(self, context):
        return self.nodelist.render(context)


@register.tag('lesson')
def wrap_lesson(parser, token):
    nodelist = parser.parse(('endlesson',))
    parser.delete_first_token()
    return LessonNode(nodelist)


class WrapperNode(Node):
    def __init__(self, nodelist, html_before, html_after):
        self.nodelist = nodelist
        self.html_before = html_before
        self.html_after = html_after

    def render(self, context):
        return (Template(str(self.html_before)).render(context) + 
                self.nodelist.render(context) + 
                Template(str(self.html_after)).render(context))


class SectionNode(WrapperNode):
    """Секция урока. Заголовок не вставляется здесь: numbering и уровень
    вложенности вычисляются в load_lesson, а разметка делается в
    lesson_section.html. Старый h3 с <a name> в тексте уроков не нужен."""

    def __init__(self, nodelist, section_name):
        super(SectionNode, self).__init__(nodelist, '', '')
        self.section_name = section_name

    def render(self, context):
        return self.nodelist.render(context)


class SingleNode(Node):
    def __init__(self, html):
        self.html = html

    def render(self, context):
        return Template(str(self.html)).render(context)


def create_wrapper_tag(name, html_before, html_after):
    @register.tag(name)
    def wrapper_tag_func(parser, token):
        nodelist = parser.parse(('end' + name,))
        parser.delete_first_token()
        return WrapperNode(nodelist, html_before, html_after)   


def create_parameterized_wrapper_tag(name, html_before, html_after):
    @register.tag(name)
    def wrapper_tag_func(parser, token):
        params = token.split_contents()[1:]
        nodelist = parser.parse(('end' + name,))
        parser.delete_first_token()
        try:
            return WrapperNode(nodelist, html_before.format(*[str(p)[1:-1] for p in params]), html_after)   
        except IndexError:
            raise IndexError("tag '{0}' doesn't have a required parameter".format(name))


def create_parameterized_single_tag(name, html):
    @register.tag(name)
    def wrapper_tag_func(parser, token):
        params = token.split_contents()[1:]
        try:
            return SingleNode(html.format(*[str(p)[1:-1] for p in params]))
        except IndexError:
            raise IndexError("tag '{0}' doesn't have a required parameter".format(name))


@register.tag('section')
def wrapper_tag_func(parser, token):
    params = token.split_contents()[1:]
    nodelist = parser.parse(('endsection',))
    parser.delete_first_token()
    try:
        return SectionNode(nodelist, str(params[0])[1:-1])
    except IndexError:
        raise IndexError("tag 'section' doesn't have a required parameter")


create_wrapper_tag('input', '<p class="example_header">Пример входных данных:<br><pre>', '</pre></p>')
create_wrapper_tag('output', '<p class="example_header">Пример выходных данных:<br><pre>', '</pre></p>')
create_wrapper_tag('smartsnippet', '<p><div class="smartsnippet">', '</div></p>')
create_wrapper_tag('newword', '<u>', '</u>')
create_wrapper_tag('theorem', '<p><b>Теорема. </b>', '</p>')
create_wrapper_tag('proof', '<p><i>Доказательство. </i>', ' &#x25ae;</p>')


# ---------------------------------------------------------------------------
# Оформление уроков.
#
# Старые теги выше рендерят сырой HTML без обёрток и разметки, поэтому текст
# в уроках читался как сплошной поток. Ниже — блоки, которые дают структуру:
# врезки с типом (совет/предупреждение/заметка/идея), таблицы сравнения,
# «что запомнить», «попробуй сам» и короткие однострочные примеры.
# Теги обратно совместимы: старые файлы уроков продолжают работать как раньше.
# ---------------------------------------------------------------------------

# Иконки — инлайновый SVG, а не шрифт и не эмодзи: рисуется одинаково
# в любой теме, не мигает при смене шрифта и не тянет зависимости.
# Иконки — инлайновый SVG, а не шрифт и не эмодзи: рисуются одинаково
# в любой теме, не мигают при смене шрифта и не тянут зависимостей.
# Общая сетка 18x18 и одинаковая толщина линии держат вес значков ровным.
_ICON = ('<svg class="callout-icon" viewBox="0 0 18 18" width="18" height="18"'
         ' aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5"'
         ' stroke-linecap="round" stroke-linejoin="round">{}</svg>')

_ICONS = {
    'tip': '<path d="M9 2.2a5 5 0 0 0-2.9 9.1c.4.3.6.8.7 1.3l.1.6h4.2l.1-.6c.1-.5.3-1 .7-1.3A5 5 0 0 0 9 2.2Z"/>'
           '<path d="M6.7 15.2h4.6M7.3 17h3.4"/>',
    'warning': '<path d="M9 2.6 16.2 14.6H1.8L9 2.6Z"/><path d="M9 7v3.4M9 12.4v.6"/>',
    'note': '<path d="M3.4 3h11.2v9.6L11 10.4 8.6 12.6 6.2 10.4 3.4 12.6V3Z"/>'
            '<path d="M6.2 6.4h5.6M6.2 9h3.6"/>',
    'idea': '<path d="M11.9 2.6a4.3 4.3 0 0 0-4.7 6.6l-.4 1.6H5.6l.5-2A5.7 5.7 0 0 1 13.7 3.8Z"/>'
            '<path d="M6.2 12.6h5.6M6.8 15h4.4"/>',
    'term': '<path d="M2.8 4h12.4M2.8 8.4h12.4M2.8 12.8h8"/>'
            '<circle cx="13.6" cy="13.2" r="2.6"/>',
    'remember': '<path d="M9 2.2 15.2 4.4v4.3c0 3.5-2.5 6.2-6.2 7.6-3.7-1.4-6.2-4.1-6.2-7.6V4.4L9 2.2Z"/>'
                '<path d="m6.6 8.8 1.7 1.7 3.3-3.4"/>',
    'try': '<path d="M8.8 3.4 13 12.4H4.6L8.8 3.4Z"/><path d="M13.6 4.4 16.4 3M15.4 7.6l2.4.9"/>',
}

# Подписи видны и без иконки, поэтому смысл блока не держится на одном цвете.
_CALLOUTS = {
    'tip': ('Совет', 'tip', 'Совет'),
    'warning': ('Осторожно', 'warning', 'Предупреждение'),
    'note': ('Заметка', 'note', 'Заметка'),
    'idea': ('Идея', 'idea', 'Идея'),
    'term': ('Термин', 'term', 'Термин'),
    'remember': ('Запомните', 'remember', 'Запомните'),
    'try': ('Попробуйте сами', 'try', 'Задание для практики'),
}


def _escape(text):
    from django.utils.html import escape
    return escape(text)


def _wrap_body(body):
    """Текст внутри тега приходит без обёртки: Django не превращает голый
    текст в абзац. Если блок не начинается с блочного элемента, заворачиваем
    его в <p>, иначе к тексту не применятся отступы строк."""
    body = body.strip()
    if not body:
        return ''
    if body[0] == '<' and re.match(r'</?(p|ul|ol|div|pre|table|aside|blockquote|h[1-6])[\s>]', body):
        return body
    return '<p>' + body.replace('\n\n', '</p><p>') + '</p>'


_LI = re.compile(r'<li\b[^>]*>(.*?)</li>', re.S | re.I)


def _list_items(body):
    """Собирает <li> из текста, если автор их не написал: в уроках пункты
    пишутся просто строками, по одному на строку."""
    found = _LI.findall(body)
    if found:
        return body
    items = [line.strip() for line in body.splitlines() if line.strip()]
    if not items:
        return ''
    return ''.join('<li>{}</li>'.format(_wrap_body(item)) for item in items)


def _callout(name, body, label=None):
    kind = name if name in _CALLOUTS else 'note'
    default_label, icon_key, a11y = _CALLOUTS[kind]
    heading = _escape(label or default_label)
    return (
        '<aside class="callout callout-{kind}" role="note" aria-label="{a11y}">'
        '<p class="callout-head"><span class="callout-icon-wrap">{icon}</span>'
        '<span class="callout-title">{heading}</span></p>'
        '<div class="callout-body">{body}</div>'
        '</aside>'
    ).format(kind=kind, a11y=a11y, icon=_icon(icon_key), heading=heading,
             body=_wrap_body(body))


def _icon(key):
    return _ICON.format(_ICONS[key])


def make_callout_tag(name):
    @register.tag(name)
    def callout_tag(parser, token):
        params = token.split_contents()[1:]
        nodelist = parser.parse(('end' + name,))
        parser.delete_first_token()
        label = str(params[0])[1:-1].strip("'\"") if params else None
        return CalloutNode(name, nodelist, label)
    return callout_tag


class CalloutNode(Node):
    def __init__(self, kind, nodelist, label=None):
        self.kind = kind
        self.nodelist = nodelist
        self.label = label

    def render(self, context):
        body = self.nodelist.render(context).strip()
        if not body:
            return ''
        return mark_safe(_callout(self.kind, body, self.label))


for _name in ('tip', 'warning', 'note', 'idea', 'term', 'remember', 'try'):
    make_callout_tag(_name)


class RememberListNode(Node):
    """Итог урока в виде чек-листа."""

    def __init__(self, nodelist, title):
        self.nodelist = nodelist
        self.title = title

    def render(self, context):
        body = self.nodelist.render(context)
        heading = _escape(self.title or 'Главное из урока')
        return mark_safe(
            '<section class="lesson-summary" aria-labelledby="lesson-summary-title">'
            '<h2 class="lesson-summary-title" id="lesson-summary-title">'
            '<span class="lesson-summary-badge" aria-hidden="true">{badge}</span>{heading}</h2>'
            '<ul class="lesson-summary-list">{body}</ul></section>'
        ).format(badge=_icon('remember'), heading=heading, body=_list_items(body))


@register.tag('remember')
def remember_tag(parser, token):
    params = token.split_contents()[1:]
    nodelist = parser.parse(('endremember',))
    parser.delete_first_token()
    title = str(params[0])[1:-1].strip("'\"") if params else None
    return RememberListNode(nodelist, title)


def create_table_tag(name, cls):
    @register.tag(name)
    def table_tag(parser, token):
        params = token.split_contents()[1:]
        nodelist = parser.parse(('end' + name,))
        parser.delete_first_token()
        caption = str(params[0])[1:-1].strip("'\"") if params else None
        return TableNode(nodelist, caption, cls)
    return table_tag


_ROW = re.compile(r'<tr\b[^>]*>(.*?)</tr>', re.S | re.I)
_CELL = re.compile(r'<(td|th)\b[^>]*>(.*?)</\1>', re.S | re.I)


def _split_header(body):
    """Первая строка, где все ячейки — <th>, становится <thead>.
    Так подпись столбцов попадает в <thead> и оформляется единообразно,
    а терять <th> из первого экрана нельзя: без него таблица
    нечитаема для скринридеров при навигации по заголовкам."""
    match = _ROW.search(body)
    if not match:
        return body, None
    first = match.group(0)
    cells = _CELL.findall(first)
    if not cells or not all(tag.lower() == 'th' for tag, _ in cells):
        return body, None
    return body.replace(first, '', 1), first


class TableNode(Node):
    """Оборачивает готовую таблицу в карточку со скроллом и подписью.
    Содержимое не разбирается: автор пишет <tr>/<td> сам."""

    def __init__(self, nodelist, caption, cls):
        self.nodelist = nodelist
        self.caption = caption
        self.cls = cls

    def render(self, context):
        body = self.nodelist.render(context).strip()
        if not body:
            return ''
        if '<table' in body:
            # Автор уже написал таблицу целиком — добавим только класс
            # и подпись, ничего не переставляя.
            if 'class=' not in body.split('>', 1)[0]:
                body = body.replace('<table', '<table class="lesson-table ' + self.cls + '"', 1)
            if self.caption:
                body = body.replace('>', '><caption>' + _escape(self.caption) + '</caption>', 1)
            return mark_safe('<div class="lesson-table-wrap">' + body + '</div>')
        rest, header = _split_header(body)
        caption = '<caption>' + _escape(self.caption) + '</caption>' if self.caption else ''
        thead = '<thead>' + header + '</thead>' if header else ''
        return mark_safe(
            '<div class="lesson-table-wrap"><table class="lesson-table ' + self.cls + '">' +
            caption + thead + '<tbody>' + rest + '</tbody></table></div>'
        )


create_table_tag('table', 'lesson-table')


class SnippetNode(Node):
    """Однострочный или короткий пример вне визуализатора."""

    def __init__(self, nodelist, caption=None):
        self.nodelist = nodelist
        self.caption = caption

    def render(self, context):
        code = self.nodelist.render(context).strip()
        if not code:
            return ''
        head = ''
        if self.caption:
            head = ('<p class="snippet-caption">{icon}<span>{cap}</span></p>'
                    .format(icon=_icon('term'),
                            cap=_escape(self.caption)))
        return mark_safe(
            '<div class="lesson-snippet">{head}<pre class="lesson-snippet-code">{code}</pre></div>'
        .format(head=head, code=code))


@register.tag('snippet')
def snippet_tag(parser, token):
    params = token.split_contents()[1:]
    nodelist = parser.parse(('endsnippet',))
    parser.delete_first_token()
    caption = str(params[0])[1:-1].strip("'\"") if params else None
    return SnippetNode(nodelist, caption)


class KeylineNode(Node):
    """Формулировка «запомнить на одну строку»."""

    def __init__(self, nodelist):
        self.nodelist = nodelist

    def render(self, context):
        body = self.nodelist.render(context).strip()
        if not body:
            return ''
        return mark_safe(
            '<p class="lesson-keyline">{icon}<span>{body}</span></p>'
        .format(icon=_icon('idea'), body=body))


@register.tag('keyline')
def keyline_tag(parser, token):
    nodelist = parser.parse(('endkeyline',))
    parser.delete_first_token()
    return KeylineNode(nodelist)


class ChecklistNode(Node):
    """Список «что уже умеем». Автор пишет обычные <li>, тег только
    оформляет их галочками: разбирать HTML на элементы было бы хрупко."""

    def __init__(self, nodelist, title=None):
        self.nodelist = nodelist
        self.title = title

    def render(self, context):
        body = self.nodelist.render(context).strip()
        if not body:
            return ''
        head = ''
        if self.title:
            head = ('<p class="checklist-title">{icon}<span>{t}</span></p>'
                    .format(icon=_icon('try'), t=_escape(self.title)))
        return mark_safe(
            '<div class="lesson-checklist">{head}<ul class="checklist-list">{body}</ul></div>'
        .format(head=head, body=_list_items(body)))


@register.tag('checklist')
def checklist_tag(parser, token):
    params = token.split_contents()[1:]
    nodelist = parser.parse(('endchecklist',))
    parser.delete_first_token()
    title = str(params[0])[1:-1].strip("'\"") if params else None
    return ChecklistNode(nodelist, title)


# create_parameterized_wrapper_tag('section', u'<h3>{0}</h3>', '')
create_parameterized_wrapper_tag('subsection', '<h4>{0}</h4>', '')

create_parameterized_single_tag('img', '<p align="center"><img src="' + LESSON_IMG_ROOT + '{0}" width="{1}%"></p>')
