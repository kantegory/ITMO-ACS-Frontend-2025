document.addEventListener('DOMContentLoaded', async () => {
  // Проверка текущего пользователя
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }

  // Подставляем имя пользователя в приветствие
  const userGreeting = document.getElementById('userGreeting');
  userGreeting.textContent = `Добро пожаловать, ${currentUser.name}!`;

  // Кнопка "Выйти"
  const logoutBtn = document.getElementById('logoutBtn');
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
  });

  // Получаем бронирования с сервера
  try {
    const response = await fetch(`http://localhost:3000/bookings?email=${encodeURIComponent(currentUser.email)}`);
    if (!response.ok) throw new Error('Ошибка при загрузке бронирований');

    const bookings = await response.json();
    const userBookings = document.getElementById('userBookings');

    if (!bookings.length) {
      userBookings.innerHTML = '<p class="text-muted">Бронирований пока нет</p>';
      return;
    }

    userBookings.innerHTML = '';
    bookings.forEach(b => {
      const item = document.createElement('div');
      item.className = 'list-group-item';
      item.innerHTML = `
        <h5>${b.name}</h5>
        <p class="mb-1">Дата: ${b.date}</p>
        <small>Гостей: ${b.guests}</small>
      `;
      userBookings.appendChild(item);
    });
  } catch (err) {
    const userBookings = document.getElementById('userBookings');
    userBookings.innerHTML = '<p class="text-danger">Ошибка загрузки бронирований</p>';
    console.error(err);
  }
});
