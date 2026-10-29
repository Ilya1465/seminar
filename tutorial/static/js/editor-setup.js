/* Общие настройки редакторов кода: отступы по Tab, запуск по Ctrl+Enter, масштаб.
   Подключается сразу после ace.js на всех страницах с редактором.

   Шрифт и межстрочный интервал здесь не задаются: в этой сборке Ace они берутся
   только из CSS (.ace_editor в polish.css), методов setFontFamily/setLineHeight нет. */
(function (window) {
    'use strict';

    var INDENT = 4;
    var MIN_FONT_SIZE = 11;
    var MAX_FONT_SIZE = 24;
    var ZOOM_KEY = 'tutor-code-font-size';

    function readZoom() {
        try {
            var saved = parseInt(localStorage.getItem(ZOOM_KEY), 10);
            return isFinite(saved) && saved >= MIN_FONT_SIZE && saved <= MAX_FONT_SIZE ? saved : null;
        } catch (_) { return null; }
    }

    function writeZoom(value) {
        try {
            if (value) localStorage.setItem(ZOOM_KEY, String(value));
            else localStorage.removeItem(ZOOM_KEY);
        } catch (_) { /* приватный режим: просто не сохраняем */ }
    }

    function clampFontSize(size) {
        return Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, Math.round(size)));
    }

    // Отступы делаем сами: в этой сборке Ace нет ни editor.outdent, ни
    // outdentRows, а editor.indent вставляет не четыре пробела, а три.
    // delta > 0 добавляет ширину табуляции, delta < 0 снимает её.
    function shiftIndent(editor, delta) {
        var session = editor.session;
        var Range = editor.getSelectionRange().constructor;
        var range = editor.getSelectionRange();
        var tab = session.getTabString();
        var changed = {};

        if (delta > 0) {
            // Снизу вверх, чтобы номера строк не «поехали» после вставки.
            for (var last = range.end.row; last >= range.start.row; last--) {
                session.replace(new Range(last, 0, last, 0), tab);
                changed[last] = tab.length;
            }
        } else {
            for (var first = range.start.row; first <= range.end.row; first++) {
                var match = /^(\t| {1,4})/.exec(session.getLine(first));
                if (!match) continue;
                var count = match[0] === '\t' ? 1 : match[0].length;
                session.replace(new Range(first, 0, first, count), '');
                changed[first] = -count;
            }
        }
        if (!Object.keys(changed).length) return;

        function shiftColumn(row, column) {
            var total = 0;
            for (var r in changed) {
                if (Number(r) < row) total += changed[r];
                // Вставка идёт перед курсором, а снятие отступа — только если
                // курсор стоит правее снимаемого куска.
                else if (Number(r) === row) total += changed[r] > 0 ? changed[r] : -Math.min(-changed[r], column);
            }
            return Math.max(0, column + total);
        }
        editor.selection.setSelectionRange(new Range(
            range.start.row, shiftColumn(range.start.row, range.start.column),
            range.end.row, shiftColumn(range.end.row, range.end.column)
        ));
    }

    function applyFontSize(editor, size) {
        editor.setFontSize(clampFontSize(size));
        // Ace кеширует размеры символов, поэтому после смены кегля пересчитываем их:
        // иначе высота строки остаётся от старого font-size.
        var renderer = editor.renderer;
        if (typeof renderer.updateFontSize === 'function') renderer.updateFontSize(editor.getFontSize());
        if (typeof renderer.updateFull === 'function') renderer.updateFull();
    }

    function enhance(editor, options) {
        if (!editor || editor.__tutorEnhanced) return editor;
        options = options || {};

        var baseFontSize = clampFontSize(options.fontSize || editor.getFontSize());

        editor.setOptions({
            showPrintMargin: false,     // колонка 80 — пережиток печатной вёрстки
            highlightGutterLine: true,  // номер строки подсвечивается вместе с ней
            displayIndentGuides: true,
            behavioursEnabled: true
        });
        editor.session.setTabSize(INDENT);
        editor.session.setUseSoftTabs(true);
        applyFontSize(editor, readZoom() || baseFontSize);
        editor.__tutorEnhanced = true;

        // Escape «вооружает» следующий Tab, чтобы из редактора можно было уйти
        // с клавиатуры: иначе перехват Tab ловит пользователя в ловушке.
        var escapeArmed = false;
        var input = editor.textInput.getElement();
        input.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                escapeArmed = true;
                return;
            }
            if (event.key !== 'Tab') return;
            if (escapeArmed) {
                escapeArmed = false;
                return; // Tab уйдёт на следующий элемент сам
            }
            event.preventDefault();
            event.stopPropagation();
            if (event.shiftKey) {
                shiftIndent(editor, -1);
            } else {
                shiftIndent(editor, 1);
            }
        });
        // Если пользователь ушёл мышью, сбрасываем флаг: следующий Tab снова отступает.
        input.addEventListener('blur', function () { escapeArmed = false; });

        if (typeof options.onRun === 'function') {
            editor.commands.addCommand({
                name: 'tutorRunCode',
                bindKey: { win: 'Ctrl-Enter', mac: 'Command-Enter' },
                exec: function () { options.onRun(editor); }
            });
        }

        function isTypingTarget(target) {
            var tag = (target && target.tagName || '').toLowerCase();
            return tag === 'input' || tag === 'textarea' || tag === 'select' || !!(target && target.isContentEditable);
        }

        document.addEventListener('keydown', function (event) {
            if (!event.ctrlKey && !event.metaKey) return;
            var key = event.key;
            var isZoomIn = key === '=' || key === '+' || key === 'Add';
            var isZoomOut = key === '-' || key === '_' || key === 'Subtract';
            var isReset = key === '0' || event.code === 'Digit0' || event.code === 'Numpad0';
            if (!isZoomIn && !isZoomOut && !isReset) return;
            // Не перехватываем, если пользователь печатает в поле вопроса ассистента.
            if (isTypingTarget(event.target) && !input.contains(event.target)) return;
            event.preventDefault();
            if (isReset) {
                writeZoom(null);
                applyFontSize(editor, baseFontSize);
                return;
            }
            var next = editor.getFontSize() + (isZoomIn ? 1 : -1);
            applyFontSize(editor, next);
            writeZoom(next);
        });

        return editor;
    }

    window.TutorEditor = { enhance: enhance };
})(window);
