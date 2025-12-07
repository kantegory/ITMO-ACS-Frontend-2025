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
    const iconUse = toggle.querySelector('.theme-toggle-icon use');
    if (iconUse) {
      const currentHref = iconUse.getAttribute('href') || iconUse.getAttribute('xlink:href') || '';
      let spriteBase = iconUse.getAttribute('data-sprite-base') || (iconUse.dataset ? iconUse.dataset.spriteBase : '');
      if (!spriteBase) {
        spriteBase = currentHref.includes('#') ? currentHref.split('#')[0] : currentHref;
        iconUse.setAttribute('data-sprite-base', spriteBase || '');
        if (iconUse.dataset) {
          iconUse.dataset.spriteBase = spriteBase || '';
        }
      }
      const targetId = isDark ? 'icon-sun' : 'icon-moon';
      const nextHref = spriteBase ? `${spriteBase}#${targetId}` : `#${targetId}`;
      iconUse.setAttribute('href', nextHref);
      iconUse.setAttribute('xlink:href', nextHref);
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
