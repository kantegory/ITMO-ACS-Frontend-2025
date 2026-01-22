(function(global){
  const FastRent = global.FastRent = global.FastRent || {};
  const notifier = FastRent.notifications;

  function showValidation(message, type = 'danger') {
    if (notifier && typeof notifier.showModal === 'function') {
      notifier.showModal({ title: 'Сообщение', message, type });
    } else {
      console.warn(message);
    }
  }

  function handleLoginForm() {
    const services = FastRent.dataService;
    const auth = FastRent.auth;
    if (!services || !auth) return;
    const { queryUserByCredentials } = services;
    const { setCurrentUser } = auth;
    const form = document.getElementById('loginForm');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = form.email.value.trim();
      const pwd = form.password.value.trim();
      if (!email || !pwd) {
        showValidation('Пожалуйста, заполните все поля');
        return;
      }
      const found = await queryUserByCredentials(email, pwd);
      if (found) {
        setCurrentUser(found);
        window.location = 'dashboard.html';
      } else {
        showValidation('Неверные данные или сервер недоступен.');
      }
    });
  }

  function handleRegisterForm() {
    const services = FastRent.dataService;
    const auth = FastRent.auth;
    if (!services || !auth) return;
    const { findUserByEmail, createUser } = services;
    const { setCurrentUser } = auth;
    const form = document.getElementById('registerForm');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const p1 = form.password.value.trim();
      const p2 = form.confirm.value.trim();
      if (!name || !email || !p1 || !p2) {
        showValidation('Пожалуйста, заполните все поля');
        return;
      }
      if (p1 !== p2) {
        showValidation('Пароли не совпадают');
        return;
      }
      const existing = await findUserByEmail(email);
      if (existing) {
        showValidation('Пользователь с такой эл. почтой уже существует');
        return;
      }
      const username = email.split('@')[0];
      const payload = { name, email, password: p1, username };
      const created = await createUser(payload);
      if (!created) {
        return;
      }
      setCurrentUser(created);
      window.location = 'dashboard.html';
    });
  }

  FastRent.handleLoginForm = handleLoginForm;
  FastRent.handleRegisterForm = handleRegisterForm;
})(window);
