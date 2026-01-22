const restaurants = [
  {
    id: 1,
    name: "Caffe Italia",
    cuisine: "Итальянская",
    location: "Центр",
    price: "₽₽₽",
    rating: 4.8,
    reviews: 156,
    description:
      "Аутентичная итальянская кухня в сердце города. Свежая паста, пицца из дровяной печи и изысканные вина.",
    image: "images/caffe_italia.png",
    menu: [
      {
        name: "Паста Карбонара",
        price: "850₽",
        description: "Классическая римская паста с беконом и пармезаном",
      },
      {
        name: "Пицца Маргарита",
        price: "750₽",
        description: "Томатный соус, моцарелла и свежий базилик",
      },
      {
        name: "Тирамису",
        price: "450₽",
        description: "Традиционный итальянский десерт",
      },
    ],
  },
  {
    id: 2,
    name: "Кои",
    cuisine: "Японская",
    location: "Север",
    price: "₽₽",
    rating: 4.6,
    reviews: 203,
    description:
      "Традиционная японская кухня. Свежайшие суши, роллы и горячие блюда.",
    image: "images/koi.png",
    menu: [
      {
        name: "Филадельфия",
        price: "650₽",
        description: "Классический ролл с лососем и сливочным сыром",
      },
      {
        name: "Рамен",
        price: "550₽",
        description: "Японский суп с лапшой и свининой",
      },
      {
        name: "Темпура",
        price: "750₽",
        description: "Креветки и овощи в хрустящем кляре",
      },
    ],
  },
  {
    id: 3,
    name: "Le Gourmet",
    cuisine: "Французская",
    location: "Центр",
    price: "₽₽₽",
    rating: 4.9,
    reviews: 89,
    description:
      "Изысканная французская кухня от шеф-повара с мишленовским опытом.",
    image: "images/gourmet.png",
    menu: [
      {
        name: "Фуа-гра",
        price: "1850₽",
        description: "Деликатес из гусиной печени",
      },
      {
        name: "Буйабес",
        price: "1250₽",
        description: "Марсельский рыбный суп",
      },
      {
        name: "Крем-брюле",
        price: "550₽",
        description: "Классический французский десерт",
      },
    ],
  },
  {
    id: 4,
    name: "Русская рыбалка",
    cuisine: "Русская",
    location: "Запад",
    price: "₽",
    rating: 4.5,
    reviews: 178,
    description: "Традиционная русская кухня в уютной домашней атмосфере.",
    image: "images/russian_fishing.png",
    menu: [
      { name: "Борщ", price: "350₽", description: "Традиционный русский суп" },
      {
        name: "Пельмени",
        price: "450₽",
        description: "Домашние пельмени с мясом",
      },
      {
        name: "Медовик",
        price: "280₽",
        description: "Классический медовый торт",
      },
    ],
  },
  {
    id: 5,
    name: "Хачапури и Вино",
    cuisine: "Грузинская",
    location: "Юг",
    price: "₽₽",
    rating: 4.7,
    reviews: 145,
    description:
      "Настоящая грузинская кухня. Хинкали, хачапури и грузинские вина.",
    image: "images/khachapuri_wine.png",
    menu: [
      {
        name: "Хинкали",
        price: "80₽/шт",
        description: "Грузинские пельмени с мясом и бульоном",
      },
      {
        name: "Хачапури по-аджарски",
        price: "550₽",
        description: "Лодочка с сыром, маслом и яйцом",
      },
      { name: "Шашлык", price: "750₽", description: "Свинина на мангале" },
    ],
  },
];

let currentUser = null;
let userBookings = [];

function initializeApp() {
  const savedUser = localStorage.getItem("currentUser");
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
  }

  const savedBookings = localStorage.getItem("userBookings");
  if (savedBookings) {
    userBookings = JSON.parse(savedBookings);
  }

  updateNavigation();
}

document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
});

function displayFeaturedRestaurants() {
  const container = document.getElementById("featured-restaurants");
  const featured = restaurants.slice(0, 3);
  container.innerHTML = featured
    .map((restaurant) => createRestaurantCard(restaurant))
    .join("");
}

function displayRestaurants(filtered = restaurants) {
  const container = document.getElementById("restaurants-list");
  container.innerHTML = filtered
    .map((restaurant) => createRestaurantCard(restaurant))
    .join("");
}

function createRestaurantCard(restaurant) {
  return `
        <div class="col-md-4">
            <div class="card restaurant-card">
                <img src="${restaurant.image}" class="card-img-top" alt="${
    restaurant.name
  }">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title mb-0">${restaurant.name}</h5>
                        <span class="price-badge">${restaurant.price}</span>
                    </div>
                    <div class="mb-2">
                        <span class="restaurant-rating">
                            ${"★".repeat(
                              Math.floor(restaurant.rating)
                            )}${"☆".repeat(5 - Math.floor(restaurant.rating))}
                        </span>
                        <span class="text-muted ms-2">${restaurant.rating} (${
    restaurant.reviews
  } отзывов)</span>
                    </div>
                    <p class="text-muted mb-2">
                        <i class="bi bi-geo-alt"></i> ${restaurant.location} | 
                        <i class="bi bi-tag"></i> ${restaurant.cuisine}
                    </p>
                    <p class="card-text">${restaurant.description.substring(
                      0,
                      100
                    )}...</p>
                    <button class="btn btn-primary w-100" onclick="showRestaurantDetails(${
                      restaurant.id
                    })">
                        Подробнее
                    </button>
                </div>
            </div>
        </div>
    `;
}

function applyFilters() {
  const cuisine = document.getElementById("filter-cuisine").value;
  const location = document.getElementById("filter-location").value;
  const price = document.getElementById("filter-price").value;
  const query = document.getElementById("search-query").value.toLowerCase();

  const filtered = restaurants.filter((restaurant) => {
    return (
      (!cuisine || restaurant.cuisine === cuisine) &&
      (!location || restaurant.location === location) &&
      (!price || restaurant.price === price) &&
      (!query || restaurant.name.toLowerCase().includes(query))
    );
  });

  displayRestaurants(filtered);
}

function showRestaurantDetails(restaurantId) {
  window.location.href = `restaurant.html?id=${restaurantId}`;
}

function displayRestaurantDetails(restaurantId) {
  const restaurant = restaurants.find((r) => r.id === restaurantId);
  if (!restaurant) return;

  const reviews = [
    {
      author: "Анна К.",
      rating: 5,
      text: "Отличное место! Вкусная еда и приятная атмосфера.",
      date: "15.11.2025",
    },
    {
      author: "Михаил П.",
      rating: 4,
      text: "Хорошее обслуживание, рекомендую!",
      date: "10.11.2025",
    },
    {
      author: "Елена С.",
      rating: 5,
      text: "Лучший ресторан в городе! Обязательно вернемся.",
      date: "05.11.2025",
    },
  ];

  const detailsHTML = `
        <button class="btn btn-outline-secondary mb-3" onclick="window.location.href='restaurants.html'">
            <i class="bi bi-arrow-left"></i> Назад к поиску
        </button>
        <div class="card shadow-lg">
            <img src="${
              restaurant.image
            }" class="card-img-top" style="height: 400px; object-fit: cover;" alt="${
    restaurant.name
  }">
            <div class="card-body p-4">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <h2>${restaurant.name}</h2>
                        <div class="mb-2">
                            <span class="restaurant-rating fs-5">
                                ${"★".repeat(
                                  Math.floor(restaurant.rating)
                                )}${"☆".repeat(
    5 - Math.floor(restaurant.rating)
  )}
                            </span>
                            <span class="text-muted ms-2">${
                              restaurant.rating
                            } (${restaurant.reviews} отзывов)</span>
                        </div>
                        <p class="text-muted mb-0">
                            <i class="bi bi-geo-alt"></i> ${
                              restaurant.location
                            } | 
                            <i class="bi bi-tag"></i> ${restaurant.cuisine} | 
                            ${restaurant.price}
                        </p>
                    </div>
                    <button class="btn btn-primary btn-lg" onclick="openBookingModal(${
                      restaurant.id
                    })">
                        <i class="bi bi-calendar-check"></i> Забронировать
                    </button>
                </div>
                <p class="lead">${restaurant.description}</p>
                
                <hr class="my-4">
                
                <h4 class="mb-3"><i class="bi bi-card-list"></i> Меню</h4>
                <div class="menu-list">
                    ${restaurant.menu
                      .map(
                        (item) => `
                        <div class="menu-item">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 class="mb-1">${item.name}</h6>
                                    <p class="text-muted mb-0">${item.description}</p>
                                </div>
                                <strong class="text-primary">${item.price}</strong>
                            </div>
                        </div>
                    `
                      )
                      .join("")}
                </div>
                
                <hr class="my-4">
                
                <h4 class="mb-3"><i class="bi bi-chat-left-text"></i> Отзывы</h4>
                ${reviews
                  .map(
                    (review) => `
                    <div class="review-card">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <strong>${review.author}</strong>
                            <small class="text-muted">${review.date}</small>
                        </div>
                        <div class="restaurant-rating mb-2">
                            ${"★".repeat(review.rating)}${"☆".repeat(
                      5 - review.rating
                    )}
                        </div>
                        <p class="mb-0">${review.text}</p>
                    </div>
                `
                  )
                  .join("")}
            </div>
        </div>
    `;

  document.getElementById("restaurant-details").innerHTML = detailsHTML;
}

function openBookingModal(restaurantId) {
  if (!currentUser) {
    alert("Пожалуйста, войдите в систему для бронирования");
    window.location.href = "login.html";
    return;
  }

  document.getElementById("booking-restaurant-id").value = restaurantId;
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("booking-date").setAttribute("min", today);

  const modal = new bootstrap.Modal(document.getElementById("bookingModal"));
  modal.show();
}

function submitBooking(event) {
  event.preventDefault();

  const restaurantId = parseInt(
    document.getElementById("booking-restaurant-id").value
  );
  const restaurant = restaurants.find((r) => r.id === restaurantId);
  const date = document.getElementById("booking-date").value;
  const time = document.getElementById("booking-time").value;
  const guests = document.getElementById("booking-guests").value;
  const comment = document.getElementById("booking-comment").value;

  const booking = {
    id: Date.now(),
    restaurantId: restaurantId,
    restaurantName: restaurant.name,
    date: date,
    time: time,
    guests: guests,
    comment: comment,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };

  userBookings.push(booking);

  localStorage.setItem("userBookings", JSON.stringify(userBookings));

  const modal = bootstrap.Modal.getInstance(
    document.getElementById("bookingModal")
  );
  modal.hide();

  alert("Бронирование успешно создано!");
  event.target.reset();
}

function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById("login-email").value;

  currentUser = {
    name: "Иван",
    email: email,
    phone: "+7 (999) 123-45-67",
  };

  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  updateNavigation();
  alert("Вход выполнен успешно!");
  window.location.href = "index.html";
}

function handleRegister(event) {
  event.preventDefault();

  const password = document.getElementById("register-password").value;
  const confirmPassword = document.getElementById(
    "register-confirm-password"
  ).value;

  if (password !== confirmPassword) {
    alert("Пароли не совпадают!");
    return;
  }

  const name = document.getElementById("register-name").value;
  const email = document.getElementById("register-email").value;
  const phone = document.getElementById("register-phone").value;

  currentUser = { name, email, phone };

  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  updateNavigation();
  alert("Регистрация успешно завершена!");
  window.location.href = "index.html";
}

function logout() {
  currentUser = null;
  userBookings = [];

  localStorage.removeItem("currentUser");
  localStorage.removeItem("userBookings");

  updateNavigation();
  alert("Вы вышли из системы");
  window.location.href = "index.html";
}

function updateNavigation() {
  const isLoggedIn = currentUser !== null;

  const navLogin = document.getElementById("nav-login");
  const navRegister = document.getElementById("nav-register");
  const navProfile = document.getElementById("nav-profile");
  const navLogout = document.getElementById("nav-logout");

  if (navLogin) navLogin.style.display = isLoggedIn ? "none" : "block";
  if (navRegister) navRegister.style.display = isLoggedIn ? "none" : "block";
  if (navProfile) navProfile.style.display = isLoggedIn ? "block" : "none";
  if (navLogout) navLogout.style.display = isLoggedIn ? "block" : "none";
}

function displayUserProfile() {
  const profileName = document.getElementById("profile-name");
  const profileEmail = document.getElementById("profile-email");
  const profileEditName = document.getElementById("profile-edit-name");
  const profileEditPhone = document.getElementById("profile-edit-phone");

  if (profileName) profileName.textContent = currentUser.name;
  if (profileEmail) profileEmail.textContent = currentUser.email;
  if (profileEditName) profileEditName.value = currentUser.name;
  if (profileEditPhone) profileEditPhone.value = currentUser.phone;
}

function displayBookingsHistory() {
  const bookingsContainer = document.getElementById("bookings-history");
  if (!bookingsContainer) return;

  const bookingsHTML =
    userBookings.length > 0
      ? userBookings
          .map((booking) => {
            const statusClass =
              booking.status === "confirmed"
                ? "status-confirmed"
                : booking.status === "pending"
                ? "status-pending"
                : "status-cancelled";
            const statusText =
              booking.status === "confirmed"
                ? "Подтверждено"
                : booking.status === "pending"
                ? "Ожидание"
                : "Отменено";

            return `
            <div class="card booking-card">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h6 class="mb-0">${booking.restaurantName}</h6>
                        <span class="status-badge ${statusClass}">${statusText}</span>
                    </div>
                    <p class="text-muted mb-2">
                        <i class="bi bi-calendar"></i> ${new Date(
                          booking.date
                        ).toLocaleDateString("ru-RU")} в ${booking.time}<br>
                        <i class="bi bi-people"></i> ${
                          booking.guests
                        } ${getGuestsWord(booking.guests)}
                    </p>
                    ${
                      booking.comment
                        ? `<p class="mb-0"><small>Комментарий: ${booking.comment}</small></p>`
                        : ""
                    }
                    <div class="mt-3">
                        <button class="btn btn-sm btn-outline-danger" onclick="cancelBooking(${
                          booking.id
                        })">
                            <i class="bi bi-x-circle"></i> Отменить
                        </button>
                    </div>
                </div>
            </div>
        `;
          })
          .join("")
      : '<p class="text-muted">У вас пока нет бронирований</p>';

  bookingsContainer.innerHTML = bookingsHTML;
}

function getGuestsWord(count) {
  if (count === 1) return "гость";
  if (count >= 2 && count <= 4) return "гостя";
  return "гостей";
}

function cancelBooking(bookingId) {
  if (confirm("Вы уверены, что хотите отменить бронирование?")) {
    const booking = userBookings.find((b) => b.id === bookingId);
    if (booking) {
      booking.status = "cancelled";
      localStorage.setItem("userBookings", JSON.stringify(userBookings));
      displayBookingsHistory();
      alert("Бронирование отменено");
    }
  }
}

function updateProfile(event) {
  event.preventDefault();
  currentUser.name = document.getElementById("profile-edit-name").value;
  currentUser.phone = document.getElementById("profile-edit-phone").value;

  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  displayUserProfile();
  alert("Профиль успешно обновлен!");
}

document.addEventListener("DOMContentLoaded", function () {
  displayFeaturedRestaurants();
  displayRestaurants();

  const bookingDateElement = document.getElementById("booking-date");
  if (bookingDateElement) {
    const today = new Date().toISOString().split("T")[0];
    bookingDateElement.setAttribute("min", today);
  }
});
