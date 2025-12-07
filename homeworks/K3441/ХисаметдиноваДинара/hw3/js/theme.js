class ThemeManager {
    constructor() {
        this.themes = ['auto', 'light', 'dark'];
        this.currentTheme = this.getStoredTheme() || 'auto';
        this.initTheme();
        this.createNavbarToggle();
    }

    getStoredTheme() {
        return localStorage.getItem('theme');
    }

    storeTheme(theme) {
        localStorage.setItem('theme', theme);
    }

    getEffectiveTheme() {
        if (this.currentTheme === 'auto') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return this.currentTheme;
    }

    applyTheme(theme) {
        const root = document.documentElement;

        root.removeAttribute('data-theme');

        if (theme !== 'auto') {
            root.setAttribute('data-theme', theme);
        }

        this.updateMetaThemeColor(theme);
    }

    updateMetaThemeColor(theme) {
        const effectiveTheme = theme === 'auto' ? this.getEffectiveTheme() : theme;
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');

        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }

        metaThemeColor.content = effectiveTheme === 'dark' ? '#1a1a1a' : '#ffffff';
    }

    initTheme() {
        this.applyTheme(this.currentTheme);

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (this.currentTheme === 'auto') {
                this.applyTheme('auto');
                this.updateNavbarToggleIcon();
            }
        });
    }

    cycleTheme() {
        const currentIndex = this.themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % this.themes.length;
        this.setTheme(this.themes[nextIndex]);
    }

    setTheme(theme) {
        if (!this.themes.includes(theme)) return;

        this.currentTheme = theme;
        this.storeTheme(theme);
        this.applyTheme(theme);
        this.updateNavbarToggleIcon();

        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: theme, effectiveTheme: this.getEffectiveTheme() }
        }));
    }

    createNavbarToggle() {
        const navbars = document.querySelectorAll('.navbar-nav');

        navbars.forEach(navbar => {
            const loginLink = navbar.querySelector('a[href*="login"]');
            if (loginLink) {
                const themeToggle = document.createElement('li');
                themeToggle.className = 'nav-item';
                themeToggle.innerHTML = `
                    <a href="#" class="nav-link" id="themeToggle" aria-label="Toggle theme">
                        ☀️
                    </a>
                `;

                navbar.insertBefore(themeToggle, loginLink.closest('.nav-item'));

                const toggleLink = themeToggle.querySelector('#themeToggle');
                toggleLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.cycleTheme();
                });
            }
        });

        const existingToggles = document.querySelectorAll('#themeToggle');
        existingToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.cycleTheme();
            });
        });

        this.updateNavbarToggleIcon();
    }

    updateNavbarToggleIcon() {
        const toggleButtons = document.querySelectorAll('#themeToggle');

        const currentIndex = this.themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % this.themes.length;
        const nextTheme = this.themes[nextIndex];

        const icons = {
            'auto': '🌓',
            'light': '☀️',
            'dark': '🌙'
        };

        toggleButtons.forEach(button => {
            button.innerHTML = icons[nextTheme];
            button.setAttribute('title', `Switch to ${nextTheme} theme (currently: ${this.currentTheme})`);
        });
    }

    getCurrentTheme() {
        return {
            selected: this.currentTheme,
            effective: this.getEffectiveTheme()
        };
    }
}
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}