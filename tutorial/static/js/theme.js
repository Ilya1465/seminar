/* Light/dark/system theme chooser. Runs early (head) to avoid a flash of the wrong theme. */
(function () {
    'use strict';
    var STORAGE_KEY = 'tutor-theme';
    var themes = ['light', 'dark', 'system'];
    var prefersDarkQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

    function appliedTheme(preferred) {
        if (preferred === 'system') {
            return prefersDarkQuery && prefersDarkQuery.matches ? 'dark' : 'light';
        }
        return preferred;
    }

    function readPreference() {
        var value;
        try { value = localStorage.getItem(STORAGE_KEY); } catch (_) {}
        return themes.indexOf(value) === -1 ? 'system' : value;
    }

    var saved = readPreference();
    document.documentElement.setAttribute('data-theme', appliedTheme(saved));

    function label(theme) {
        var names = {light: 'Светлая', dark: 'Тёмная', system: 'Системная'};
        return names[theme] || 'Системная';
    }

    function refreshButtonText(button, theme) {
        if (!button) return;
        var span = button.querySelector('.theme-name');
        if (span) span.textContent = label(theme);
    }

    function bindToggle() {
        var button = document.getElementById('theme-toggle');
        if (button) {
            button.setAttribute('data-theme-name', saved);
            button.setAttribute('aria-label', 'Тема оформления: ' + label(saved) + '. Нажмите, чтобы изменить.');
            refreshButtonText(button, saved);
            button.addEventListener('click', cycle);
        }
    }

    function cycle() {
        var current = readPreference();
        var next = themes[(themes.indexOf(current) + 1) % themes.length];
        try { localStorage.setItem(STORAGE_KEY, next); } catch (_) {}
        document.documentElement.setAttribute('data-theme', appliedTheme(next));
        var button = document.getElementById('theme-toggle');
        if (button) {
            button.setAttribute('aria-label', 'Тема оформления: ' + label(next) + '. Нажмите, чтобы изменить.');
            button.setAttribute('data-theme-name', next);
            refreshButtonText(button, next);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bindToggle);
    } else {
        bindToggle();
    }

    window.tutorTheme = { appliedTheme: appliedTheme };
    if (prefersDarkQuery && typeof prefersDarkQuery.addEventListener === 'function') {
        prefersDarkQuery.addEventListener('change', function () {
            if (readPreference() === 'system') {
                document.documentElement.setAttribute('data-theme', appliedTheme('system'));
            }
        });
    }
})();