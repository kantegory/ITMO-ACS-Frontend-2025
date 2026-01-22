class ThemeManager {
  constructor() {
    this.themes = {
      light: 'light',
      dark: 'dark'
    };
    this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
    this.init();
  }

  getStoredTheme() {
    return localStorage.getItem('theme');
  }

  getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return this.themes.dark;
    }
    return this.themes.light;
  }

  setStoredTheme(theme) {
    localStorage.setItem('theme', theme);
  }

  setTheme(theme) {
    if (!Object.values(this.themes).includes(theme)) {
      console.warn(`Тема "${theme}" не найдена`);
      return;
    }

    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    this.setStoredTheme(theme);
    this.updateThemeToggle();
  }

  toggleTheme() {
    const newTheme = this.currentTheme === this.themes.light 
      ? this.themes.dark 
      : this.themes.light;
    this.setTheme(newTheme);
  }

  updateThemeToggle() {
    const toggleButtons = document.querySelectorAll('[data-theme-toggle]');
    toggleButtons.forEach(btn => {
      let iconSvg = btn.querySelector('.icon svg use');
      if (iconSvg) {
        if (this.currentTheme === this.themes.dark) {
          iconSvg.setAttribute('href', '#icon-sun');
          btn.setAttribute('aria-label', 'Переключить на светлую тему');
        } else {
          iconSvg.setAttribute('href', '#icon-moon');
          btn.setAttribute('aria-label', 'Переключить на тёмную тему');
        }
      } else {
        const icon = btn.querySelector('i');
        if (icon) {
          if (this.currentTheme === this.themes.dark) {
            icon.className = 'bi bi-sun-fill';
            btn.setAttribute('aria-label', 'Переключить на светлую тему');
          } else {
            icon.className = 'bi bi-moon-fill';
            btn.setAttribute('aria-label', 'Переключить на тёмную тему');
          }
        }
      }
    });
  }

  init() {
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.updateThemeToggle();
      });
    } else {
      this.updateThemeToggle();
    }

    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        if (!this.getStoredTheme()) {
          this.setTheme(e.matches ? this.themes.dark : this.themes.light);
        }
      });
    }

    document.addEventListener('click', (e) => {
      const toggleBtn = e.target.closest('[data-theme-toggle]');
      if (toggleBtn) {
        e.preventDefault();
        this.toggleTheme();
      }
    });
  }

  getCurrentTheme() {
    return this.currentTheme;
  }
}

export const themeManager = new ThemeManager();

