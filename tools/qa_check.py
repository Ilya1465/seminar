#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""qa_check.py — офлайн-верификатор проекта «AI Наставник».

Автор: opencode/big-pickle (сессия, файл личный). Только ЧТЕНИЕ, ничего не правит.
Использование:  python tools/qa_check.py [--verbose]

Проверки:
  1. mentor.html: все локальные css/js, на которые есть ссылки, существуют;
     порядок базовых скриптов (tutor.js -> data/tutor.js -> mentor-ui.js).
  2. Скобочный баланс JS-файлов (с учётом строк и комментариев).
  3. i18n-покрытие: l("...") и T("...") должны резолвиться в словарях
     (LOCAL ru/en + MENTOR_UI ru/en + MENTOR_COURSES ru/en, если есть).
  4. getElementById("<id>") — id должен быть в mentor.html или создаваться
     в HTML-шаблонах того же файла.
  5. Пустые/подозрительно пустые файлы, не-UTF8.
  6. Эвристика коротких «вставок-артефактов» (по паттерну прежней порчи).
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Отсортированные пути (кортежи относительных путей)
def paths(*rel):
    return [p for p in rel]

MAIN_HTML = os.path.join(ROOT, "mentor.html")
JS_FILES = paths(
    ("js", "tutor.js"), ("js", "mentor-ui.js"),
    ("js", "onboard.js"), ("js", "app.js"), ("js", "tutor-starter.js"),
    ("js", "tasks.js"), ("js", "quiz.js"), ("js", "lessons.js"),
    ("js", "i18n.js"), ("js", "editor.js"), ("js", "cheat.js"),
)
DATA_FILES = paths(
    ("data", "tutor.js"), ("data", "courses.js"),
    ("data", "tasks.js"), ("data", "quiz.js"), ("data", "lessons.js"),
    ("data", "i18n.js"), ("data", "cheat.js"),
)
CSS_FILES = paths(("css", "mentor.css"), ("css", "neon.css"), ("css", "style.css"))

SCRIPT_ORDER = [
    ("js", "tutor.js"),
    ("data", "tutor.js"),
    ("data", "courses.js"),
    ("data", "ai-db.js"),
    ("js", "auth.js"),
    ("js", "auth-ui.js"),
    ("js", "mentor-ui.js"),
    ("js", "onboard.js"),
]
CSS_ORDER = [
    ("css", "mentor.css"),
    ("css", "neon.css"),
]

ERR = []
WARN = []


def err(msg):
    ERR.append(msg)


def warn(msg):
    WARN.append(msg)


def read_text(path):
    try:
        with open(path, "rb") as f:
            raw = f.read()
        return raw.decode("utf-8")
    except FileNotFoundError:
        err("файл НЕ НАЙДЕН: %s" % rel(path))
        return None
    except UnicodeDecodeError:
        err("не в UTF-8: %s" % rel(path))
        return None


def rel(path):
    try:
        return os.path.relpath(path, ROOT)
    except ValueError:
        return path


def exists(*relpath):
    return os.path.exists(os.path.join(ROOT, *relpath))


# ---------- 1) ссылки из mentor.html ----------
def check_html(path):
    html = read_text(path)
    if html is None:
        return
    for m in re.finditer(r'(?:src|href)="((?:css|js|data)/[^"]+)"', html):
        ref = m.group(1)
        if not exists(*ref.split("/")):
            err("mentor.html ссылается на отсутствующий файл: %s" % ref)
    # порядок скриптов
    scripts = re.findall(r'<script src="([^"]+)"></script>', html)
    for i, want in enumerate(SCRIPT_ORDER):
        join = "/".join(want)
        if join not in scripts:
            err("mentor.html не подключает базовый скрипт в нужном виде: %s" % join)
        elif scripts.index(join) != i:
            err("mentor.html: базовый скрипт %s вне рекомендуемого порядка" % join)
    # порядок css
    css = re.findall(r'<link rel="stylesheet" href="([^"]+)">', html)
    for i, want in enumerate(CSS_ORDER):
        join = "/".join(want)
        if join not in css:
            err("mentor.html не подключает базовый css: %s" % join)
        elif css.index(join) != i:
            err("mentor.html: css %s вне рекомендуемого порядка" % join)


def check_contracts():
    """Проверка стыковок MENTOR_COURSES / MENTOR_LANGS / MENTOR_RANKS."""
    if not exists("data", "courses.js"):
        return
    all_src = read_text(os.path.join(ROOT, "data", "courses.js"))
    mui = read_text(os.path.join(ROOT, "js", "mentor-ui.js"))
    onb = read_text(os.path.join(ROOT, "js", "onboard.js"))
    if all_src is None:
        return
    if "window.MENTOR_COURSES" in all_src:
        if mui and "MENTOR_COURSES" not in mui:
            warn("courses.js объявляет MENTOR_COURSES, но mentor-ui читает только MENTOR_LANGS — новые языки не попадут в Тренажёр")
        if onb and "MENTOR_COURSES" not in onb:
            warn("onboard.js не читает MENTOR_COURSES")
    if "window.MENTOR_RANKS = {" in all_src:
        if onb and "MENTOR_RANKS.length" in onb:
            warn("MENTOR_RANKS — объект {ru:[],en:[]}, а onboard проверяет .length (onboard.js:87) — ранги из courses.js не применяются")
        if "min:" in all_src:
            if onb and re.search(r"\br\.(from|xp)\b", onb) and not re.search(r"\br\.min\b", onb):
                warn("записи рангов используют поле 'min', а onboard.rankFrom читает from/xp — ранг всегда 0")
    if all_src and "MENTOR_ONBOARD" in all_src and onb and "MENTOR_ONBOARD" not in onb:
        warn("courses.js определяет MENTOR_ONBOARD, но onboard.js его не использует (тексты захардкожены по-русски)")


# ---------- 2) скобочный баланс ----------
REGEX_PREV = set("([{=,:;!&|?+-*%<>~^")


def strip_js_scope(src):
    """Убираем строки, комментарии и regex-литералы, оставляя скобки/операторы."""
    out = []
    i, n = 0, len(src)
    state = "code"
    prev = "\n"
    while i < n:
        c = src[i]
        if state == "code":
            if c == '"' or c == "'" or c == "`":
                state = {"\"": "str_double", "'": "str_single", "`": "str_tpl"}[c]
                i += 1
            elif c == "/" and i + 1 < n and src[i + 1] == "/":
                state = "line_comment"
                i += 2
            elif c == "/" and i + 1 < n and src[i + 1] == "*":
                state = "block_comment"
                i += 2
            elif c == "/" and prev in REGEX_PREV:
                state = "regex"
                i += 1
            else:
                if not c.isspace():
                    prev = c
                out.append(c)
                i += 1
        elif state == "str_single":
            if c == "\\":
                i += 2
            elif c == "'":
                state = "code"
                i += 1
            else:
                i += 1
        elif state == "str_double":
            if c == "\\":
                i += 2
            elif c == '"':
                state = "code"
                i += 1
            else:
                i += 1
        elif state == "str_tpl":
            if c == "\\":
                i += 2
            elif c == "`":
                state = "code"
                i += 1
            else:
                i += 1
        elif state == "line_comment":
            if c == "\n":
                state = "code"
                prev = "\n"
                out.append(c)
                i += 1
            else:
                i += 1
        elif state == "block_comment":
            if c == "*" and i + 1 < n and src[i + 1] == "/":
                state = "code"
                i += 2
            else:
                i += 1
        elif state == "regex":
            if c == "\\":
                i += 2
            elif c == "[":
                state = "regex_class"
                i += 1
            elif c == "/":
                state = "regex_flags"
                i += 1
            elif c == "\n":
                state = "code"
                prev = "\n"
                out.append("\n")
                i += 1
            else:
                i += 1
        elif state == "regex_class":
            if c == "\\":
                i += 2
            elif c == "]":
                state = "regex"
                i += 1
            else:
                i += 1
        elif state == "regex_flags":
            if c.isalpha():
                i += 1
            else:
                state = "code"
                prev = "\n"
    return "".join(out)


def check_balance(path, src):
    body = strip_js_scope(src)
    stack = []
    pairs = {")": "(", "]": "[", "}": "{"}
    for c in body:
        if c in "([{":
            stack.append(c)
        elif c in ")]}":
            if not stack or stack[-1] != pairs[c]:
                err("скобочный дисбаланс в %s: лишняя '%s'" % (rel(path), c))
                return
            stack.pop()
    if stack:
        err("скобочный дисбаланс в %s: не закрыто %d скобок (: %s"
            % (rel(path), len(stack), stack[-1] == "("))


# ---------- 3) i18n-покрытие ----------
def balanced_block(src, start):
    """Возвращает текст от '{' (start) до парной '}' включительно."""
    depth = 0
    i = start
    n = len(src)
    while i < n:
        c = src[i]
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                return src[start:i + 1]
        i += 1
    return None


KEY_VALUE = re.compile(r'([A-Za-z0-9_]+)\s*:\s*"((?:[^"\\]|\\.)*)"')


def extract_i18n_blocks(src, anchor):
    """Собирает пары ключ: "значение" из ВСЕХ объектов после anchor."""
    d = {}
    pos = 0
    while True:
        idx = src.find(anchor, pos)
        if idx < 0:
            break
        start = src.find("{", idx)
        if start >= 0:
            block = balanced_block(src, start)
            if block:
                for m in KEY_VALUE.finditer(block):
                    d[m.group(1)] = m.group(2)
        pos = idx + len(anchor)
    return d


def check_i18n():
    all_dicts = {}
    for f in DATA_FILES + JS_FILES:
        if not exists(*f):
            continue
        src = read_text(os.path.join(ROOT, *f))
        if src is None:
            continue
        for anchor, lang in (("ru:", "ru"), ("en:", "en")):
            blocks = extract_i18n_blocks(src, anchor)
            all_dicts.setdefault(lang, set()).update(blocks.keys())
    ru_keys = all_dicts.get("ru", set())
    en_keys = all_dicts.get("en", set())
    # usage
    for f in JS_FILES:
        if not exists(*f):
            continue
        src = read_text(os.path.join(ROOT, *f))
        if src is None:
            continue
        for m in re.finditer(r'\bT\(\s*"([^"]+)"\s*\)', src):
            key = m.group(1)
            if key not in ru_keys and key not in en_keys:
                err("i18n-ключ T('%s') не найден ни в одном словаре (Файл %s)"
                    % (key, "/".join(f)))
        for m in re.finditer(r'\bl\(\s*"([^"]+)"\s*\)', src):
            key = m.group(1)
            if key not in ru_keys and key not in en_keys:
                err("i18n-ключ l('%s') не найден в словарях (%s)"
                    % (key, "/".join(f)))
    if "tries" not in ru_keys or "streak" not in ru_keys:
        warn("словари не содержат tries/streak (ru) — «Прогресс» покажет ключи")
    if "tries" not in en_keys or "streak" not in en_keys:
        warn("словари не содержат tries/streak (en)")


# ---------- 4) id-check ----------
def collect_ids_from_templates(src):
    ids = set()
    for m in re.finditer(r'id="([^"]+)"', src):
        ids.add(m.group(1))
    return ids


def check_ids():
    html = read_text(MAIN_HTML)
    html_ids = collect_ids_from_templates(html or "")
    for f in JS_FILES:
        if not exists(*f):
            continue
        src = read_text(os.path.join(ROOT, *f))
        if src is None:
            continue
        known = set(html_ids) | collect_ids_from_templates(src)
        for m in re.finditer(r'getElementById\("([^"]+)"\)', src):
            if m.group(1) not in known:
                err("getElementById('%s') не найден ни в mentor.html, ни в шаблонах %s"
                    % (m.group(1), "/".join(f)))


# ---------- 5) пустые файлы ----------
def check_sizes():
    for f in JS_FILES + DATA_FILES + CSS_FILES:
        if not exists(*f):
            continue
        p = os.path.join(ROOT, *f)
        sz = os.path.getsize(p)
        if sz == 0:
            err("файл ПУСТ: %s" % rel(p))
        elif sz < 50:
            warn("файл подозрительно мал (%d б): %s" % (sz, rel(p)))


# ---------- 6) артефакты ----------
def check_artifacts():
    # похоже на «вставку» при порче: идентификатор вида Abc123 в коде выражения
    for f in JS_FILES + DATA_FILES:
        if not exists(*f):
            continue
        src = read_text(os.path.join(ROOT, *f))
        if src is None:
            continue
        for m in re.finditer(r'\b[A-Z][a-z]+\d\w*\b', src):
            warn("подозрительный идентификатор '%s' в %s (проверь вручную)"
                 % (m.group(0), "/".join(f)))


# ---------- main ----------
def main():
    verbose = "--verbose" in sys.argv
    if exists(*("tools", "qa_check.py")):
        pass
    check_html(MAIN_HTML)
    check_contracts()
    for f in JS_FILES + DATA_FILES:
        if not exists(*f):
            continue
        src = read_text(os.path.join(ROOT, *f))
        if src is not None:
            check_balance(os.path.join(ROOT, *f), src)
    check_i18n()
    check_ids()
    check_sizes()
    check_artifacts()

    print("=== QA-проверка проекта «AI Наставник» ===")
    print("Ошибок (blocking): %d   Предупреждений: %d" % (len(ERR), len(WARN)))
    for e in ERR:
        print("  [ERR ] " + e)
    for w in WARN:
        print("  [WARN] " + w)
    print("----------------------")
    return 1 if ERR else 0


if __name__ == "__main__":
    sys.exit(main())