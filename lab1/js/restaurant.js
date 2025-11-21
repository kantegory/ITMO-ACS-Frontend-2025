document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get('id'));

  const restaurants = [
    {id:1, name:"La Piazza", cuisine:"Итальянская", location:"Центр", price:2, img:"img/sample-restaurant.jpg",
      description:"Уютный итальянский ресторан с домашней пастой и печёной пиццей.",
      menu:["Пицца Маргарита", "Паста Карбонара", "Тирамису"],
      reviews:[
        "Очень вкусно, как в Италии! ⭐⭐⭐⭐⭐",
        "Лучшее место для ужина вдвоём. ⭐⭐⭐⭐⭐",
        "Понравилось обслуживание. ⭐⭐⭐⭐⭐"
      ]
    },
    {id:2, name:"Sushi Time", cuisine:"Японская", location:"Север", price:3, img:"img/sample-sushi.jpg",
      description:"Современный суши-бар с авторскими роллами и свежей рыбой.",
      menu:["Филадельфия", "Темпура ролл", "Рамен"],
      reviews:[
        "Рыба очень свежая! ⭐⭐⭐⭐⭐",
        "Быстрая подача, вкусные роллы. ⭐⭐⭐⭐⭐",
        "Лучшая японская кухня в городе. ⭐⭐⭐⭐⭐"
      ]
    }
  ];

  const restaurant = restaurants.find(r => r.id === id);
  const container = document.getElementById('restaurantContainer');

  if (!restaurant) {
    container.innerHTML = `<h2>Ресторан не найден</h2>`;
    return;
  }

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
});
