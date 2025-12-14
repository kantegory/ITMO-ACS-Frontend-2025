const ThemeManager = {
    init() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
        this.createToggleButton();
    },

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateToggleIcon(theme);
    },

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    },

    createToggleButton() {
        const existingToggle = document.getElementById('themeToggle');
        if (existingToggle) {
            return;
        }

        const toggle = document.createElement('button');
        toggle.id = 'themeToggle';
        toggle.className = 'theme-toggle';
        toggle.setAttribute('aria-label', 'Переключить тему');
        toggle.setAttribute('title', 'Переключить тему');
        toggle.addEventListener('click', () => this.toggleTheme());

        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        this.updateToggleIcon(currentTheme, toggle);

        document.body.appendChild(toggle);
    },

    updateToggleIcon(theme, button = null) {
        const toggle = button || document.getElementById('themeToggle');
        if (!toggle) return;

        if (theme === 'dark') {
            toggle.textContent = '☀️';
            toggle.setAttribute('aria-label', 'Переключить на светлую тему');
            toggle.setAttribute('title', 'Переключить на светлую тему');
        } else {
            toggle.textContent = '🌙';
            toggle.setAttribute('aria-label', 'Переключить на темную тему');
            toggle.setAttribute('title', 'Переключить на темную тему');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
});

