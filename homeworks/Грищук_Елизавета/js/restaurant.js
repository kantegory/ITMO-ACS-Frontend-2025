document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get('id'));
  const container = document.getElementById('restaurantContainer');

  if (!id) {
    container.innerHTML = `<h2>Ресторан не найден</h2>`;
    return;
  }

  try {
    // Получаем данные конкретного ресторана с сервера
    const res = await fetch(`http://localhost:3000/restaurants/${id}`);
    if (!res.ok) throw new Error('Ресторан не найден');
    const restaurant = await res.json();

    container.innerHTML = `
      <div class="card p-4 shadow">
        <div class="row">
          <div class="col-md-5">
            <img src="${restaurant.img}" class="img-fluid rounded" alt="">
          </div>
          <div class="col-md-7">
            <h2>${restaurant.name}</h2>
            <p class="text-muted">${restaurant.cuisine} · ${restaurant.location} · ${"₽".repeat(restaurant.price)}</p>
            <p>${restaurant.description}</p>

            <h4 class="mt-3">Меню</h4>
            <ul>${restaurant.menu.map(i => `<li>${i}</li>`).join("")}</ul>

            <h4 class="mt-3">Отзывы</h4>
            <ul>${restaurant.reviews.map(i => `<li>${i}</li>`).join("")}</ul>

            <a href="index.html" class="btn btn-secondary mt-3">Назад</a>
            <a href="index.html#booking" class="btn btn-primary mt-3">Забронировать</a>
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<h2>${err.message}</h2>`;
  }
});
