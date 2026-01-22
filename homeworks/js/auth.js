document.addEventListener('DOMContentLoaded', () => {

  // Регистрация
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async e => {
      e.preventDefault();

      const name = document.getElementById('regName').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const password = document.getElementById('regPassword').value;

      // Проверка существующих пользователей через API
      const res = await fetch(`http://localhost:3000/users?email=${encodeURIComponent(email)}`);
      const existingUsers = await res.json();
      if (existingUsers.length > 0) {
        alert('Пользователь с таким email уже зарегистрирован');
        return;
      }

      // Создаем нового пользователя на сервере
      await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      alert('Регистрация прошла успешно');
      window.location.href = 'login.html';
    });
  }


  // Вход
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async e => {
      e.preventDefault();

      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;

      const res = await fetch(`http://localhost:3000/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
      const users = await res.json();
      const user = users[0];

      if (!user) {
        alert('Неверный email или пароль');
        return;
      }

      localStorage.setItem('currentUser', JSON.stringify(user));
      window.location.href = 'account.html';
    });
  }


  // ---------------- Личный кабинет ----------------
  const userGreeting = document.getElementById('userGreeting');
  const logoutBtn = document.getElementById('logoutBtn');

  if (userGreeting) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
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
});

