(function(global){
  global.FastRent = global.FastRent || {};
  const currentScript = document.currentScript;
  const basePath = currentScript ? currentScript.src.substring(0, currentScript.src.lastIndexOf('/') + 1) : '';
  const modulePaths = [
    'modules/icons.js',
    'modules/theme.js',
    'modules/notifications.js',
    'modules/dataService.js',
    'modules/auth.js',
    'modules/navbar.js',
    'modules/forms.js',
    'modules/booking.js',
    'pages/search.js',
    'pages/dashboard.js',
    'pages/profile.js',
    'pages/property.js',
    'pages/messages.js'
  ];

  function resolvePath(rel) {
    if (/^https?:/i.test(rel) || rel.startsWith('/')) return rel;
    if (!basePath) return rel;
    return basePath + rel;
  }

  function loadScriptSequential(paths) {
    return paths.reduce((promise, relPath) => {
      return promise.then(() => new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = resolvePath(relPath);
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Не удалось загрузить ${script.src}`));
        document.head.appendChild(script);
      }));
    }, Promise.resolve());
  }

  async function initApp() {
    const FastRent = global.FastRent || {};
    if (typeof FastRent.initThemeToggle === 'function') FastRent.initThemeToggle();
    if (typeof FastRent.renderNavbar === 'function') FastRent.renderNavbar();
    if (typeof FastRent.handleLoginForm === 'function') FastRent.handleLoginForm();
    if (typeof FastRent.handleRegisterForm === 'function') FastRent.handleRegisterForm();
    if (typeof FastRent.initBooking === 'function') FastRent.initBooking();

    const pages = FastRent.pages || {};
    const bodyPage = document.body.getAttribute('data-page');
    try {
      if (bodyPage === 'search' && typeof pages.search === 'function') await pages.search();
      if (bodyPage === 'dashboard' && typeof pages.dashboard === 'function') await pages.dashboard();
      if (bodyPage === 'profile' && typeof pages.profile === 'function') await pages.profile();
      if (bodyPage === 'property' && typeof pages.property === 'function') await pages.property();
      if (bodyPage === 'messages' && typeof pages.messages === 'function') await pages.messages();
    } catch (err) {
      console.error('Ошибка инициализации страницы FastRent', err);
    }
  }

  loadScriptSequential(modulePaths)
    .then(() => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          initApp().catch((err) => console.error('FastRent init error', err));
        });
      } else {
        initApp().catch((err) => console.error('FastRent init error', err));
      }
    })
    .catch((err) => {
      console.error('Не удалось загрузить скрипты FastRent', err);
    });
})(window);
