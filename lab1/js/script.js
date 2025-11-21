document.addEventListener('DOMContentLoaded', () => {
  const restaurantsData = [
    {id:1, name:"La Piazza", cuisine:"Итальянская", location:"Центр", price:2, img:"img/sample-restaurant.jpg"},
    {id:2, name:"Sushi Time", cuisine:"Японская", location:"Север", price:3, img:"img/sample-sushi.jpg"}
  ];

  const list = document.getElementById('restaurants');

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
            <button class="btn btn-primary btn-book" data-id="${r.id}" data-name="${r.name}">Забронировать</button>
          </div>
        </div>`;
      list.appendChild(col);
    });

    const bookingModalEl = document.getElementById('bookingModal');
    const bookingModal = new bootstrap.Modal(bookingModalEl);
    const bookingTitle = document.getElementById('bookingTitle');
    const bookingForm = document.getElementById('bookingForm');

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

    bookingForm.addEventListener('submit', e => {
  e.preventDefault();

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) {
    alert('Сначала войдите в аккаунт');
    return;
  }

  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');

  bookings.push({
    email: currentUser.email, // привязка к пользователю
    id: document.getElementById('restaurantId').value,
    name: bookingTitle.textContent.replace('Бронирование: ',''),
    date: document.getElementById('bookingDate').value,
    guests: document.getElementById('guestsCount').value
  });

  localStorage.setItem('bookings', JSON.stringify(bookings));
  alert('Бронирование сохранено локально');
  bookingModal.hide();
});

  }

  render(restaurantsData);
});
