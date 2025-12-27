const Theme = (() => {
    const storageKey = 'theme';
    const themes = { light: 'light', dark: 'dark' };
    let systemListenerAttached = false;

    const getStoredTheme = () => {
        try {
            return localStorage.getItem(storageKey);
        } catch (e) {
            console.warn('Не удалось прочитать тему из localStorage:', e);
            return null;
        }
    };

    const getSystemTheme = () => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return themes.dark;
        }
        return themes.light;
    };

    const getActiveTheme = () => {
        return document.documentElement.getAttribute('data-theme') || getStoredTheme() || getSystemTheme();
    };

    const updateToggle = (theme) => {
        const toggle = document.getElementById('themeToggle');
        if (!toggle) return;

        const isDark = theme === themes.dark;
        toggle.setAttribute('aria-pressed', isDark);
        toggle.textContent = `${isDark ? '☀️' : '🌙'} ${isDark ? 'Светлая тема' : 'Тёмная тема'}`;
    };

    const applyTheme = (theme, persist = true) => {
        const safeTheme = theme === themes.dark ? themes.dark : themes.light;
        document.documentElement.setAttribute('data-theme', safeTheme);
        document.documentElement.dataset.bsTheme = safeTheme === themes.dark ? 'dark' : 'light';

        if (persist) {
            try {
                localStorage.setItem(storageKey, safeTheme);
            } catch (e) {
                console.warn('Не удалось сохранить тему в localStorage:', e);
            }
        }

        updateToggle(safeTheme);
    };

    const toggleTheme = () => {
        const current = getActiveTheme();
        const next = current === themes.dark ? themes.light : themes.dark;
        applyTheme(next);
    };

    const bindToggle = () => {
        const toggle = document.getElementById('themeToggle');
        if (!toggle || toggle.dataset.bound === 'true') return;

        toggle.dataset.bound = 'true';
        toggle.addEventListener('click', toggleTheme);
        updateToggle(getActiveTheme());
    };

    const attachSystemListener = () => {
        if (systemListenerAttached || !window.matchMedia) return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (event) => {
            // Если пользователь уже выбрал тему вручную — уважаем выбор
            if (getStoredTheme()) return;
            applyTheme(event.matches ? themes.dark : themes.light, false);
        });

        systemListenerAttached = true;
    };

    const init = () => {
        const stored = getStoredTheme();
        const initial = document.documentElement.getAttribute('data-theme') || stored || getSystemTheme();

        applyTheme(initial, Boolean(stored));
        bindToggle();
        attachSystemListener();
    };

    const refreshToggle = () => {
        bindToggle();
        updateToggle(getActiveTheme());
    };

    return {
        init,
        refreshToggle
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    Theme.init();
});

