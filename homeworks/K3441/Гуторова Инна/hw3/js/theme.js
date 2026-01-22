const toggle = document.getElementById('themeToggle');

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    if (toggle) {
        toggle.textContent = theme === 'dark' ? '🌙' : '🌞';
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
