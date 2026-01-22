document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('restaurants');
  const bookingModalEl = document.getElementById('bookingModal');
  const bookingModal = new bootstrap.Modal(bookingModalEl);
  const bookingTitle = document.getElementById('bookingTitle');
  const bookingForm = document.getElementById('bookingForm');
  const toggleBtn = document.getElementById('themeToggle');
  const body = document.body;

  let currentRestaurants = [];

  // ---------------- Получаем рестораны ----------------
  fetch('http://localhost:3000/restaurants')
    .then(res => res.json())
    .then(data => {
      currentRestaurants = data;
      render(currentRestaurants);
    });

  function render(arr) {
    list.innerHTML = '';
    arr.forEach(r => {
      const col = document.createElement('div');
      col.className = 'col';
      col.innerHTML = `
        <div class="card h-100">
          <img src="${r.img}" class="card-img-top" alt="${r.name}">
          <div class="card-body">
            <h3 class="card-title">${r.name}</h3>
            <p class="card-text text-muted">${r.cuisine} · ${r.location} · ${'₽'.repeat(r.price)}</p>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-secondary btn-more" data-id="${r.id}">Подробнее</button>
              <button class="btn btn-primary btn-book" data-id="${r.id}" data-name="${r.name}">Забронировать</button>
            </div>
          </div>
        </div>`;
      list.appendChild(col);
    });

    document.querySelectorAll('.btn-more').forEach(btn => {
      btn.addEventListener('click', e => {
        const id = e.currentTarget.dataset.id;
        window.location.href = `restaurant.html?id=${id}`;
      });
    });

    document.querySelectorAll('.btn-book').forEach(btn => {
      btn.addEventListener('click', e => {
        const id = e.currentTarget.dataset.id;
        const name = e.currentTarget.dataset.name;
        document.getElementById('restaurantId').value = id;
        bookingTitle.textContent = `Бронирование: ${name}`;
        document.getElementById('guestName').value = '';
        document.getElementById('bookingDate').value = '';
        document.getElementById('guestsCount').value = 2;
        bookingModal.show();
      });
    });
  }

  // ---------------- Отправка бронирования ----------------
  bookingForm.addEventListener('submit', async e => {
    e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return alert('Сначала войдите в аккаунт');

    const booking = {
      email: currentUser.email,
      restaurantId: document.getElementById('restaurantId').value,
      name: bookingTitle.textContent.replace('Бронирование: ', ''),
      date: document.getElementById('bookingDate').value,
      guests: Number(document.getElementById('guestsCount').value)
    };

    await fetch('http://localhost:3000/bookings', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(booking)
    });

    alert('Бронирование сохранено на сервере!');
    bookingModal.hide();
  });

  // ---------------- Фильтры ----------------
  document.getElementById('applyFilters').addEventListener('click', () => {
    const cuisine = document.getElementById('filterCuisine').value.trim();
    const location = document.getElementById('filterLocation').value.trim().toLowerCase();
    const price = document.getElementById('filterPrice').value;

    let filtered = currentRestaurants;
    if (cuisine) filtered = filtered.filter(r => r.cuisine === cuisine);
    if (location) filtered = filtered.filter(r => r.location.toLowerCase().includes(location));
    if (price) filtered = filtered.filter(r => r.price <= Number(price));

    render(filtered);
  });

  // -------------------- Переключение темы --------------------
  if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-theme');
    if (toggleBtn) toggleBtn.textContent = 'Светлая тема';
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      body.classList.toggle('dark-theme');
      if (body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
        toggleBtn.textContent = 'Светлая тема';
      } else {
        localStorage.setItem('theme', 'light');
        toggleBtn.textContent = 'Тёмная тема';
      }
    });
  }
  document.body.classList.add('dark-theme');
  console.log(getComputedStyle(document.body).backgroundColor);
});
