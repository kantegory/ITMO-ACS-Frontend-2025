document.addEventListener('DOMContentLoaded', () => {
   const loginModalEl = document.getElementById('loginModal');
    let loginModal;
    if (loginModalEl) loginModal = new bootstrap.Modal(loginModalEl);

    const registerModalEl = document.getElementById('registerModal');
    let registerModal;
    if (registerModalEl) registerModal = new bootstrap.Modal(registerModalEl);

    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');

    loginBtn?.addEventListener('click', () => loginModal?.show());
    registerBtn?.addEventListener('click', () => registerModal?.show());

    document.getElementById('closeLogin')?.addEventListener('click', () => loginModal?.hide());
    document.getElementById('closeRegister')?.addEventListener('click', () => registerModal?.hide());

    const bookBtn = document.getElementById('bookBtn');
    const bookingModalEl = document.getElementById('bookingModal');
    let bookingModal;
    if (bookingModalEl) bookingModal = new bootstrap.Modal(bookingModalEl);
    bookBtn?.addEventListener('click', () => bookingModal?.show());
    document.getElementById('closeBooking')?.addEventListener('click', () => bookingModal?.hide());

    const restaurants = [
        { 
            id: "1", 
            name: "Итальянский Ресторан", 
            cuisine: "Итальянская", 
            location: "Центр", 
            price: "₽₽",
            images: ["assets/images/italian.jpg", "assets/images/italian2.jpg"],
            menu: ["Паста Карбонара — 450 ₽", "Маргарита — 350 ₽", "Тирамису — 250 ₽"],
            reviews: [
                {name: "Иван", text:"Отличная паста и уютная атмосфера!"},
                {name:"Мария", text:"Очень понравились десерты."}
            ]
        },
        { 
            id: "2", 
            name: "Суши Бар", 
            cuisine: "Японская", 
            location: "Север", 
            price: "₽₽₽",
            images: ["assets/images/sushi.jpg"],
            menu: ["Суши", "Роллы"],
            reviews: [
                {name:"Алексей", text:"Свежие роллы, рекомендую!"}
            ]
        },
        { 
            id: "3", 
            name: "Русская кухня", 
            cuisine: "Русская", 
            location: "Юг", 
            price: "₽",
            images: ["assets/images/russian.jpg"],
            menu: ["Щи", "Борщ"],
            reviews: [
                {name:"Светлана", text:"Домашняя кухня, очень вкусно."}
            ]
        },
        { 
            id: "4", 
            name: "Бургерная", 
            cuisine: "Фастфуд", 
            location: "Восток", 
            price: "₽",
            images: ["assets/images/burger.jpg"],
            menu: ["Чизбургер", "Картошка фри"],
            reviews: [
                {name:"Пётр", text:"Бургеры сочные и большие."}
            ]
        }
    ];

    const restaurantList = document.getElementById('restaurantList');
    if (restaurantList) {
        function renderRestaurants(list) {
            restaurantList.innerHTML = '';
            list.forEach(r => {
                const card = document.createElement('div');
                card.classList.add('col-md-3', 'mb-4');
                card.innerHTML = `
                    <div class="card">
                        <img src="${r.images[0]}" class="card-img-top" alt="${r.name}">
                        <div class="card-body">
                            <h5 class="card-title">${r.name}</h5>
                            <p class="card-text">${r.cuisine}, ${r.location}, ${r.price}</p>
                            <a href="restaurant.html?id=${r.id}" class="btn btn-primary">Подробнее</a>
                        </div>
                    </div>
                `;
                restaurantList.appendChild(card);
            });
        }

        const searchBtn = document.getElementById('searchBtn');
        searchBtn?.addEventListener('click', () => {
            const cuisine = document.getElementById('cuisine').value;
            const location = document.getElementById('location').value;
            const price = document.getElementById('price').value;

            const filtered = restaurants.filter(r => {
                return (cuisine === "" || r.cuisine === cuisine) &&
                       (location === "" || r.location === location) &&
                       (price === "" || r.price === price);
            });

            renderRestaurants(filtered);
        });

        renderRestaurants(restaurants);
    }

    const restaurantId = new URLSearchParams(window.location.search).get('id');
    if (restaurantId) {
        const restaurant = restaurants.find(r => r.id === restaurantId);
        if (restaurant) {
            const nameEl = document.getElementById('restaurantName');
            if (nameEl) nameEl.textContent = restaurant.name;

            const carouselInner = document.getElementById('carouselInner');
            if (carouselInner) {
                restaurant.images.forEach((img, i) => {
                    const div = document.createElement('div');
                    div.classList.add('carousel-item');
                    if (i === 0) div.classList.add('active');
                    div.innerHTML = `<img src="${img}" class="d-block w-100" alt="${restaurant.name}">`;
                    carouselInner.appendChild(div);
                });
            }

            const menuList = document.getElementById('menuList');
            if (menuList) {
                restaurant.menu.forEach(item => {
                    const li = document.createElement('li');
                    li.classList.add('list-group-item');
                    li.textContent = item;
                    menuList.appendChild(li);
                });
            }

            const reviewsList = document.getElementById('reviewsList');
            if (reviewsList) {
                restaurant.reviews.forEach(r => {
                    const div = document.createElement('div');
                    div.classList.add('card', 'mb-2');
                    div.innerHTML = `
                        <div class="card-body">
                            <h5 class="card-title">${r.name}</h5>
                            <p class="card-text">${r.text}</p>
                        </div>`;
                    reviewsList.appendChild(div);
                });
            }
        }
    }
});
