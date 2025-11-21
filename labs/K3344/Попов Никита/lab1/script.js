const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');

const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));

const closeLogin = document.getElementById('closeLogin');
const closeRegister = document.getElementById('closeRegister');

loginBtn.addEventListener('click', () => loginModal.show());
registerBtn.addEventListener('click', () => registerModal.show());

closeLogin.addEventListener('click', () => loginModal.hide());
closeRegister.addEventListener('click', () => registerModal.hide());

const restaurants = [
    { name: "Итальянский Ресторан", cuisine: "Итальянская", location: "Центр", price: "₽₽", img: "assets/images/italian.jpg" },
    { name: "Суши Бар", cuisine: "Японская", location: "Север", price: "₽₽₽", img: "assets/images/sushi.jpg" },
    { name: "Русская кухня", cuisine: "Русская", location: "Юг", price: "₽", img: "assets/images/russian.jpg" },
    { name: "Бургерная", cuisine: "Фастфуд", location: "Восток", price: "₽", img: "assets/images/burger.jpg" }
];

const searchBtn = document.getElementById('searchBtn');
const restaurantList = document.getElementById('restaurantList');

function renderRestaurants(list) {
    restaurantList.innerHTML = '';
    list.forEach(r => {
        const card = document.createElement('div');
        card.classList.add('col-md-3', 'mb-4');
        card.innerHTML = `
            <div class="card">
                <img src="${r.img}" class="card-img-top" alt="${r.name}">
                <div class="card-body">
                    <h5 class="card-title">${r.name}</h5>
                    <p class="card-text">${r.cuisine}, ${r.location}, ${r.price}</p>
                    <button class="btn btn-primary">Подробнее</button>
                </div>
            </div>
        `;
        restaurantList.appendChild(card);
    });
}

searchBtn.addEventListener('click', () => {
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
