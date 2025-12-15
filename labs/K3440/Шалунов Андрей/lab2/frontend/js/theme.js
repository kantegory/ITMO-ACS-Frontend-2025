const STORAGE_KEY = 'theme';

function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
        return saved;
    }

    if (window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }

    return 'light';
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);

    const btn = document.getElementById('themeToggle');
    if (!btn) return;

    const icon = btn.querySelector('[data-theme-icon]');
    const text = btn.querySelector('[data-theme-text]');

    if (icon) {
        icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
    if (text) {
        text.textContent = theme === 'dark' ? 'Светлая тема' : 'Тёмная тема';
    }

    btn.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'
    );
}

document.addEventListener('DOMContentLoaded', () => {
    const current = getPreferredTheme();
    applyTheme(current);

    const btn = document.getElementById('themeToggle');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const now = document.documentElement.getAttribute('data-theme') === 'dark'
            ? 'dark'
            : 'light';
        const next = now === 'dark' ? 'light' : 'dark';
        applyTheme(next);
    });
});