const STORAGE_KEY = 'theme';

function getStoredTheme() {
    try {
        return localStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
}

function setStoredTheme(theme) {
    try {
        localStorage.setItem(STORAGE_KEY, theme);
    } catch {
    }
}

function getSystemTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getInitialTheme() {
    return getStoredTheme() || getSystemTheme();
}

function setThemeAttr(theme) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
}

function setToggleUI(theme) {
    const textEls = document.querySelectorAll('[data-theme-text]');
    textEls.forEach((el) => {
        el.textContent = theme === 'dark' ? 'Светлая тема' : 'Тёмная тема';
    });

    const useEls = document.querySelectorAll('use[data-theme-icon]');
    useEls.forEach((useEl) => {
        const currentHref = useEl.getAttribute('href') || '';
        const base = currentHref.includes('#') ? currentHref.split('#')[0] : '../assets/icons/sprite.svg';
        const nextSymbol = theme === 'dark' ? 'icon-sun' : 'icon-moon';
        const nextHref = `${base}#${nextSymbol}`;
        useEl.setAttribute('href', nextHref);
        useEl.setAttributeNS('http://www.w3.org/1999/xlink', 'href', nextHref);
    });
}

function applyTheme(theme) {
    setThemeAttr(theme);
    setToggleUI(theme);
}

function toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';
    setStoredTheme(nextTheme);
    applyTheme(nextTheme);
}

document.addEventListener('DOMContentLoaded', () => {
    applyTheme(getInitialTheme());

    const btn = document.getElementById('themeToggle');
    if (btn) {
        btn.addEventListener('click', toggleTheme);
    }
});