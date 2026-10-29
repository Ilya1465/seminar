/* Небольшие интерактивные улучшения: копирование кода, прогресс чтения,
   всплывающие уведомления, поиск по урокам, кнопка «наверх».
   Каждая функция независима и ничего не ломает, если элементов нет. */
(function ($) {
    'use strict';

    var reducedMotion = window.matchMedia
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function scrollToTop() {
        var node = currentScrollHost();
        var options = { top: 0, behavior: reducedMotion ? 'auto' : 'smooth' };
        if (node) { node.scrollTo(options); } else { window.scrollTo(options); }
    }

    /* На страницах уроков и задач окно не скроллится: рабочая область
       (body.tutor-open) прокручивает внутренний контейнер #tutor-content.
       Проверяем по классу, а не по наличию прокрутки: на старте страницы
       контент ещё не отрисован и контейнер выглядит «нескроллящимся». */
    var cachedHost = null;

    function currentScrollHost() {
        if (!document.body.classList.contains('tutor-open')) {
            cachedHost = null;
            return null;
        }
        if (cachedHost && cachedHost.isConnected) return cachedHost;
        var node = document.getElementById('tutor-content');
        if (node) {
            var style = getComputedStyle(node);
            if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
                cachedHost = node;
                return node;
            }
        }
        return null;
    }

    function scrollMetrics() {
        var node = currentScrollHost();
        if (node) {
            return { max: node.scrollHeight - node.clientHeight, top: node.scrollTop };
        }
        var doc = document.documentElement;
        return { max: doc.scrollHeight - window.innerHeight, top: window.scrollY };
    }

    function onAnyScroll(handler) {
        // scroll не всплывает, но фаза capture на document его ловит.
        document.addEventListener('scroll', handler, true);
        window.addEventListener('resize', handler);
    }

    /* ---------------- Копирование кода ---------------- */

    function legacyCopy(text) {
        return new Promise(function (resolve, reject) {
            var area = document.createElement('textarea');
            area.value = text;
            area.setAttribute('readonly', '');
            area.style.position = 'fixed';
            area.style.top = '-1000px';
            document.body.appendChild(area);
            area.select();
            var ok = false;
            try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
            document.body.removeChild(area);
            ok ? resolve() : reject();
        });
    }

    function copyText(text) {
        // Современный API может быть недоступен или отклонён (HTTP, iframe,
        // запрет доступа) — тогда откатываемся на execCommand.
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text).catch(function () {
                return legacyCopy(text);
            });
        }
        return legacyCopy(text);
    }

    function initCopyButtons() {
        // Только «спокойные» блоки: без визуализатора, редактора, панели ИИ и таблицы тестов.
        var blocks = document.querySelectorAll('.main pre, .knowledge-article pre');
        Array.prototype.forEach.call(blocks, function (block) {
            if (block.querySelector('.copy-code')) return;
            if (block.closest('.lesson_code, #visualizer, .ace_editor, #tutor-panel, #example_tests')) return;
            if (block.classList.contains('code') || block.classList.contains('stdin')) return;
            if (!block.textContent.trim()) return;

            block.classList.add('has-copy');
            var button = document.createElement('button');
            button.type = 'button';
            button.className = 'copy-code';
            button.setAttribute('aria-label', 'Скопировать код');
            button.title = 'Скопировать';
            button.innerHTML = '<span class="fa fa-clipboard" aria-hidden="true"></span>';

            var label = document.createElement('span');
            label.className = 'copy-code-label';
            label.setAttribute('aria-live', 'polite');

            button.addEventListener('click', function () {
                copyText(block.textContent).then(function () {
                    button.classList.add('copied');
                    label.textContent = 'Скопировано';
                }, function () {
                    button.classList.add('copy-failed');
                    label.textContent = 'Не удалось';
                }).then(function () {
                    window.setTimeout(function () {
                        button.classList.remove('copied', 'copy-failed');
                        label.textContent = '';
                    }, 1800);
                });
            });

            block.appendChild(button);
            block.appendChild(label);
        });
    }

    /* ------------- Копирование примеров тестов ------------- */

    function initCopyTests() {
        var table = document.getElementById('example_tests');
        if (!table || !table.tBodies.length) return;

        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'copy-tests';
        button.innerHTML = '<span class="fa fa-clipboard" aria-hidden="true"></span> Скопировать примеры';

        function flash(text, ok) {
            button.textContent = text;
            button.classList.toggle('copied', ok);
            button.classList.toggle('copy-failed', !ok);
            window.setTimeout(function () {
                button.textContent = '';
                button.innerHTML = '<span class="fa fa-clipboard" aria-hidden="true"></span> Скопировать примеры';
                button.classList.remove('copied', 'copy-failed');
            }, 1800);
        }

        button.addEventListener('click', function () {
            var rows = table.querySelectorAll('tbody tr');
            var blocks = [];
            Array.prototype.forEach.call(rows, function (row, index) {
                var input = row.querySelector('pre.input');
                var output = row.querySelector('pre.output');
                if (!input) return;
                blocks.push(
                    'Тест ' + (index + 1) +
                    '\nВвод:\n' + input.textContent.trim() +
                    '\nВывод:\n' + (output ? output.textContent.trim() : '')
                );
            });
            if (!blocks.length) { flash('Нет примеров', false); return; }
            copyText(blocks.join('\n\n')).then(
                function () { flash('Скопировано', true); },
                function () { flash('Не удалось', false); }
            );
        });

        var heading = table.previousElementSibling;
        if (heading && /^H[1-6]$/.test(heading.tagName)) {
            heading.appendChild(button);
        } else {
            table.parentNode.insertBefore(button, table);
        }
    }

    /* ---------------- Прогресс чтения ---------------- */

    function initReadProgress() {
        var bar = document.createElement('div');
        bar.className = 'read-progress';
        bar.setAttribute('aria-hidden', 'true');
        document.body.appendChild(bar);

        var ticking = false;
        function update() {
            ticking = false;
            var m = scrollMetrics();
            var value = m.max > 0 ? Math.min(1, Math.max(0, m.top / m.max)) : 0;
            bar.style.transform = 'scaleX(' + value + ')';
            bar.classList.toggle('is-visible', value > 0.01);
        }
        function schedule() {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(update);
        }
        onAnyScroll(schedule);
        update();
    }

    // «/» фокусирует поле поиска, если пользователь не печатает и не в редакторе.
    function focusOnSlash(field) {
        document.addEventListener('keydown', function (event) {
            if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
            var tag = (event.target.tagName || '').toLowerCase();
            if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
            if (event.target.isContentEditable) return;
            if (event.target.closest && event.target.closest('.ace_editor')) return;
            event.preventDefault();
            field.focus();
            field.select();
        });
    }

    /* ---------------- Поиск по урокам ---------------- */

    function initLessonSearch() {
        var wrap = document.querySelector('.home-lessons');
        if (!wrap) return;

        var cards = wrap.querySelectorAll('.lesson-card');
        if (!cards.length) return;

        var items = Array.prototype.map.call(cards, function (card) {
            var number = card.querySelector('.lesson-number');
            var title = card.querySelector('.lesson-title');
            var haystack = ((number ? number.textContent : '') + ' ' +
                (title ? title.textContent : '')).toLowerCase().replace(/\s+/g, ' ').trim();
            return { el: card, haystack: haystack };
        });

        var panel = document.createElement('div');
        panel.className = 'lesson-search';

        var field = document.createElement('input');
        field.type = 'search';
        field.className = 'form-control';
        field.placeholder = 'Найти занятие или тему';
        field.setAttribute('aria-label', 'Найти занятие или тему');
        field.autocomplete = 'off';

        var status = document.createElement('span');
        status.className = 'lesson-search-status';
        status.setAttribute('role', 'status');
        status.setAttribute('aria-live', 'polite');

        var empty = document.createElement('p');
        empty.className = 'lesson-search-empty';
        empty.hidden = true;
        empty.textContent = 'Ничего не нашлось. Попробуйте другое слово.';

        panel.appendChild(field);
        panel.appendChild(status);
        wrap.parentNode.insertBefore(panel, wrap);
        wrap.parentNode.insertBefore(empty, wrap.nextSibling);

        function apply() {
            var query = field.value.toLowerCase().replace(/\s+/g, ' ').trim();
            var shown = 0;

            items.forEach(function (item) {
                var match = !query || item.haystack.indexOf(query) !== -1;
                item.el.hidden = !match;
                if (match) shown++;
            });

            // Скрываем «дополнительные занятия», если внутри ничего не подошло.
            var details = wrap.querySelector('.additional-lessons');
            if (details) {
                var anyVisible = details.querySelectorAll('.lesson-card:not([hidden])').length;
                details.hidden = !anyVisible;
            }

            status.textContent = query
                ? 'Показано ' + shown + ' из ' + items.length
                : '';
            empty.hidden = shown !== 0;
        }

        field.addEventListener('input', apply);
        field.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                field.value = '';
                apply();
                field.blur();
            }
        });
        apply();

        focusOnSlash(field);
    }

    /* ---------------- Поиск по базе знаний ---------------- */

    function initKnowledgeFilter() {
        var field = document.getElementById('knowledge-filter');
        var onlyOpen = document.getElementById('knowledge-only-open');
        if (!field || !onlyOpen) return;

        var status = document.getElementById('knowledge-filter-status');
        var empty = document.getElementById('knowledge-empty');
        var groups = Array.prototype.map.call(
            document.querySelectorAll('.knowledge-group'),
            function (section) {
                return {
                    section: section,
                    count: section.querySelector('.knowledge-group-count'),
                    items: Array.prototype.map.call(
                        section.querySelectorAll('.knowledge-item'),
                        function (item) {
                            return {
                                el: item,
                                open: item.getAttribute('data-unlocked') === 'yes',
                                haystack: item.textContent.toLowerCase().replace(/\s+/g, ' ').trim()
                            };
                        })
                };
            });
        if (!groups.length) return;

        var total = 0;
        groups.forEach(function (group) {
            total += group.items.length;
        });

        function apply() {
            var query = field.value.toLowerCase().replace(/\s+/g, ' ').trim();
            var openOnly = onlyOpen.checked;
            var shown = 0;

            groups.forEach(function (group) {
                var visible = 0;
                group.items.forEach(function (item) {
                    var match = (!query || item.haystack.indexOf(query) !== -1) &&
                        (!openOnly || item.open);
                    item.el.hidden = !match;
                    if (match) visible++;
                });
                group.section.hidden = visible === 0;
                // Показываем «3 из 12», только когда группа действительно отфильтрована.
                if (group.count) {
                    group.count.textContent = visible === group.items.length
                        ? '' : visible + ' из ' + group.items.length;
                }
                shown += visible;
            });

            if (status) {
                status.textContent = (query || openOnly)
                    ? 'Показано ' + shown + ' из ' + total : '';
            }
            if (empty) empty.hidden = shown !== 0;
        }

        field.addEventListener('input', apply);
        onlyOpen.addEventListener('change', apply);
        field.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                if (field.value) {
                    field.value = '';
                    apply();
                } else {
                    field.blur();
                }
            }
        });
        apply();

        focusOnSlash(field);
    }

    /* ---------------- Кнопка «наверх» ---------------- */

    function initBackToTop() {
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'back-to-top';
        button.setAttribute('aria-label', 'Наверх');
        button.title = 'Наверх';
        button.hidden = true;
        button.innerHTML = '<span class="fa fa-arrow-up" aria-hidden="true"></span>';
        button.addEventListener('click', scrollToTop);
        document.body.appendChild(button);

        var ticking = false;
        function schedule() {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(function () {
                ticking = false;
                button.hidden = scrollMetrics().top < 500;
            });
        }
        onAnyScroll(schedule);
        schedule();
    }

    $(function () {
        try {
            initCopyButtons();
            initCopyTests();
            initReadProgress();
            initLessonSearch();
            initKnowledgeFilter();
            initBackToTop();
        } catch (error) {
            if (window.console) window.console.error('interactions:', error);
        }
    });
})(jQuery);
