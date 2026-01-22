(function(global){
  const FastRent = global.FastRent = global.FastRent || {};
  const THEME_STORAGE_KEY = 'rental_theme';
  const DEFAULT_THEME = 'light';
  let currentTheme = DEFAULT_THEME;

  try {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === 'dark') {
      currentTheme = 'dark';
    }
  } catch (err) {
    console.warn('Не удалось прочитать тему из localStorage', err);
  }

  document.documentElement.setAttribute('data-theme', currentTheme);

  function setTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (err) {
      console.warn('Не удалось сохранить тему', err);
    }
  }

  function updateThemeToggleButton(theme) {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    const isDark = theme === 'dark';
    toggle.setAttribute('aria-pressed', String(isDark));
    const icon = toggle.querySelector('.theme-toggle-icon');
    if (icon) {
      icon.textContent = isDark ? '☀️' : '🌙';
    }
    const nextThemeLabel = isDark ? 'Включить светлую тему' : 'Включить тёмную тему';
    toggle.setAttribute('aria-label', nextThemeLabel);
    toggle.setAttribute('title', nextThemeLabel);
  }

  function initThemeToggle() {
    updateThemeToggleButton(currentTheme);
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    toggle.addEventListener('click', () => {
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
      updateThemeToggleButton(nextTheme);
    });
  }

  FastRent.initThemeToggle = initThemeToggle;
})(window);
