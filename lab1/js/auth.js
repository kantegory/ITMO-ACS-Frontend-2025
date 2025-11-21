document.addEventListener('DOMContentLoaded', () => {

  // Регистрация
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', e => {
      e.preventDefault();

      const name = document.getElementById('regName').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const password = document.getElementById('regPassword').value;

      // Получаем пользователей из localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      // Проверка: уже есть пользователь с таким email
      if (users.find(u => u.email === email)) {
        alert('Пользователь с таким email уже зарегистрирован');
        return;
      }

      users.push({ name, email, password });
      localStorage.setItem('users', JSON.stringify(users));

      alert('Регистрация прошла успешно');
      window.location.href = 'login.html';
    });
  }

  // Вход 
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();

      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);

      if (!user) {
        alert('Неверный email или пароль');
        return;
      }

      // Сохраняем текущего пользователя
      localStorage.setItem('currentUser', JSON.stringify(user));
      window.location.href = 'account.html';
    });
  }

  //  Личный кабинет 
  const userGreeting = document.getElementById('userGreeting');
  const logoutBtn = document.getElementById('logoutBtn');
  if (userGreeting) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      // если не авторизован — на login
      window.location.href = 'login.html';
    } else {
      userGreeting.textContent = `Добро пожаловать, ${currentUser.name}!`;
    }
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('currentUser');
      window.location.href = 'login.html';
    });
  }

  // История бронирований
  const historyList = document.getElementById('historyList');
  if (historyList) {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const userBookings = bookings.filter(b => b.email === currentUser?.email);

    if (userBookings.length === 0) {
      historyList.innerHTML = '<p class="text-muted">Бронирований пока нет</p>';
    } else {
      userBookings.forEach(b => {
        const item = document.createElement('div');
        item.className = 'list-group-item';
        item.innerHTML = `
          <h5>${b.name}</h5>
          <p class="mb-1">Дата: ${b.date}</p>
          <small>Гостей: ${b.guests}</small>
        `;
        historyList.appendChild(item);
      });
    }
  }

});
