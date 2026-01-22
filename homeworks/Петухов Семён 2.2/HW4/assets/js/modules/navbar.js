(function(global){
  const FastRent = global.FastRent = global.FastRent || {};

  function renderNavbar() {
    const auth = FastRent.auth;
    if (!auth) return;
    const { getCurrentUser, logout } = auth;
    const user = getCurrentUser();
    const navUser = document.getElementById('nav-user');
    if (!navUser) return;
    if (user) {
      navUser.innerHTML = `
        <span class="me-3">${user.name}</span>
        <a href="profile.html" class="btn btn-sm btn-outline-primary me-2 btn-icon" aria-label="Профиль">
          <svg class="icon" aria-hidden="true" focusable="false">
            <use href="assets/icons/sprite.svg#icon-profile" xlink:href="assets/icons/sprite.svg#icon-profile"></use>
          </svg>
          <span class="visually-hidden">Профиль</span>
        </a>
        <a href="dashboard.html" class="btn btn-sm btn-outline-primary me-2">Объявления</a>
        <button id="logoutBtn" class="btn btn-sm btn-danger">Выйти</button>
      `;
      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
      }
    } else {
      navUser.innerHTML = `<a href="login.html" class="btn btn-sm btn-primary">Войти</a>`;
    }
  }

  FastRent.renderNavbar = renderNavbar;
})(window);
