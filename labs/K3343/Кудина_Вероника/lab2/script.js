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
  if (!container) return;
  
  getRestaurants().then(function(restaurants) {
    const featured = restaurants.slice(0, 3);
    container.innerHTML = featured
      .map((restaurant) => createRestaurantCard(restaurant))
      .join("");
  });
}


function displayRestaurants(filtered) {
  const container = document.getElementById("restaurants-list");
  if (!container) return;
  
  if (filtered) {
    container.innerHTML = filtered
      .map((restaurant) => createRestaurantCard(restaurant))
      .join("");
  } else {
    getRestaurants().then(function(restaurants) {
      container.innerHTML = restaurants
        .map((restaurant) => createRestaurantCard(restaurant))
        .join("");
    });
  }
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

  getRestaurants().then(function(restaurants) {
    const filtered = restaurants.filter((restaurant) => {
      return (
        (!cuisine || restaurant.cuisine === cuisine) &&
        (!location || restaurant.location === location) &&
        (!price || restaurant.price === price) &&
        (!query || restaurant.name.toLowerCase().includes(query))
      );
    });

    displayRestaurants(filtered);
  });
}

function showRestaurantDetails(restaurantId) {
  window.location.href = `restaurant.html?id=${restaurantId}`;
}

function displayRestaurantDetails(restaurantId) {
  getRestaurantById(restaurantId).then(function(restaurant) {
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
  });
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
  
  getRestaurantById(restaurantId).then(function(restaurant) {
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
  });
}

function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  loginUser(email, password)
    .then(function(data) {
      currentUser = {
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
      };

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      updateNavigation();
      alert("Вход выполнен успешно!");
      window.location.href = "index.html";
    })
    .catch(function(error) {
      alert("Ошибка входа: " + error.message);
    });
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

  const userData = { name, email, phone, password };

  registerUser(userData)
    .then(function(data) {
      currentUser = { 
        name: data.user.name, 
        email: data.user.email, 
        phone: data.user.phone 
      };

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      updateNavigation();
      window.location.href = "index.html";
      alert("Регистрация успешно завершена!");
    })
    .catch(function(error) {
      alert("Ошибка регистрации: " + error.message);
    });
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
