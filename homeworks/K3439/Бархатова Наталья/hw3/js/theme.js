const themeLink = document.getElementById('theme-style');

function setTheme(theme) {
    themeLink.href = `/css/theme-${theme}.css`;
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const current = localStorage.getItem('theme') || 'light';
    setTheme(current === 'light' ? 'dark' : 'light');
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    setTheme(savedTheme);
}
