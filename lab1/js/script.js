document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('restaurants');
  const bookingModalEl = document.getElementById('bookingModal');
  const bookingModal = new bootstrap.Modal(bookingModalEl);
  const bookingTitle = document.getElementById('bookingTitle');
  const bookingForm = document.getElementById('bookingForm');
  let currentRestaurants = [];

  // Получение ресторанов с сервера
  fetch('http://localhost:3000/restaurants')
    .then(res => res.json())
    .then(data => {
      currentRestaurants = data;
      render(currentRestaurants);
    })
    .catch(err => console.error('Ошибка при получении ресторанов:', err));

  function render(arr) {
    list.innerHTML = '';
    arr.forEach(r => {
      const col = document.createElement('div');
      col.className = 'col';
      col.innerHTML = `
        <div class="card h-100">
          <img src="${r.img}" class="card-img-top" alt="${r.name}">
          <div class="card-body">
            <h5 class="card-title">${r.name}</h5>
            <p class="card-text text-muted">${r.cuisine} · ${r.location} · ${'₽'.repeat(r.price)}</p>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-secondary btn-more" data-id="${r.id}">Подробнее</button>
              <button class="btn btn-primary btn-book" data-id="${r.id}" data-name="${r.name}">Забронировать</button>
            </div>
          </div>
        </div>`;
      list.appendChild(col);
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

    document.querySelectorAll('.btn-more').forEach(btn => {
      btn.addEventListener('click', e => {
        const id = e.currentTarget.dataset.id;
        window.location.href = `restaurant.html?id=${id}`;
      });
    });
  }

  // Фильтры
  document.getElementById('applyFilters').addEventListener('click', () => {
    const cuisine = document.getElementById('filterCuisine').value.trim();
    const location = document.getElementById('filterLocation').value.trim().toLowerCase();
    const price = document.getElementById('filterPrice').value;

    let filtered = currentRestaurants;
    if (cuisine !== "") filtered = filtered.filter(r => r.cuisine === cuisine);
    if (location !== "") filtered = filtered.filter(r => r.location.toLowerCase().includes(location));
    if (price !== "") filtered = filtered.filter(r => r.price <= Number(price));

    render(filtered);
  });

  // Бронирование через API
  bookingForm.addEventListener('submit', e => {
    e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) { alert('Сначала войдите в аккаунт'); return; }

    const booking = {
      email: currentUser.email,
      id: document.getElementById('restaurantId').value,
      name: bookingTitle.textContent.replace('Бронирование: ', ''),
      date: document.getElementById('bookingDate').value,
      guests: document.getElementById('guestsCount').value
    };

    fetch('http://localhost:3000/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking)
    })
    .then(res => res.json())
    .then(data => {
      alert('Бронирование сохранено на сервере!');
      bookingModal.hide();
    })
    .catch(err => console.error('Ошибка при сохранении бронирования:', err));
  });
});
