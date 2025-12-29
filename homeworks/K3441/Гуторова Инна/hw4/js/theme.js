const toggle = document.getElementById('themeToggle');
const iconUse = toggle ? toggle.querySelector('use') : null;

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    if (iconUse) {
        iconUse.setAttribute('href', theme === 'dark' ? 'images/sprite.svg#icon-moon' : 'images/sprite.svg#icon-sun');
        toggle.setAttribute('aria-label', theme === 'dark' ? 'Включена тёмная тема' : 'Включена светлая тема');
    }
}

const savedTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
setTheme(savedTheme);

if (toggle) {
    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        setTheme(current === 'dark' ? 'light' : 'dark');
    });
}
