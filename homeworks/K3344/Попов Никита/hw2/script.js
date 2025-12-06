import { authAPI, restaurantsAPI, bookingsAPI } from './api.js';

document.addEventListener("DOMContentLoaded", () => {

    function showToast(message) {
        let toastContainer = document.getElementById("toastContainer");
        if (!toastContainer) {
            toastContainer = document.createElement("div");
            toastContainer.id = "toastContainer";
            toastContainer.classList.add("position-fixed", "top-0", "end-0", "p-3");
            document.body.appendChild(toastContainer);
        }

        const toastEl = document.createElement("div");
        toastEl.className = "toast align-items-center text-bg-primary border-0";
        toastEl.setAttribute("role", "alert");
        toastEl.setAttribute("aria-live", "assertive");
        toastEl.setAttribute("aria-atomic", "true");
        toastEl.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;
        toastContainer.appendChild(toastEl);

        const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
        toast.show();
        toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
    }

    const loginModal = document.getElementById("loginModal") ? new bootstrap.Modal("#loginModal") : null;
    const registerModal = document.getElementById("registerModal") ? new bootstrap.Modal("#registerModal") : null;
    const bookingModal = document.getElementById("bookingModal") ? new bootstrap.Modal("#bookingModal") : null;

    const loginBtn = document.getElementById("loginBtn");
    const loginBtnClose = document.getElementById("closeLogin");
    const registerBtn = document.getElementById("registerBtn");
    const registerBtnClose = document.getElementById("closeRegister");
    const headerDiv = document.querySelector("header div");


    const currentUser = authAPI.getCurrentUser();
    if (currentUser) {
        loginBtn?.classList.add("d-none");
        registerBtn?.classList.add("d-none");

        const profileBtn = document.createElement("a");
        profileBtn.href = "profile.html";
        profileBtn.textContent = "Личный кабинет";
        profileBtn.classList.add("btn", "btn-outline-light", "me-2");

        const logoutBtn = document.createElement("button");
        logoutBtn.textContent = "Выход";
        logoutBtn.classList.add("btn", "btn-outline-light");
        logoutBtn.addEventListener("click", () => {
            authAPI.logout();
            location.reload();
        });

        headerDiv?.append(profileBtn, logoutBtn);
    }


    document.querySelector("#registerModal .btn-primary")?.addEventListener("click", async () => {
        const username = document.querySelector("#registerModal input[type='text']").value.trim();
        const email = document.querySelector("#registerModal input[type='email']").value.trim();
        const password = document.querySelector("#registerModal input[type='password']").value.trim();

        if (!username || !email || !password) return showToast("Заполните все поля!");

        try {
            const response = await authAPI.register(username, email, password);
            if (response.success) {
                registerModal.hide();
                showToast(`Регистрация успешна! Добро пожаловать, ${username}`);
                setTimeout(() => location.reload(), 800);
            } else {
                showToast(response.message || "Ошибка регистрации");
            }
        } catch (error) {
            showToast(error.message || "Ошибка регистрации");
        }
    });


    document.querySelector("#loginModal .btn-primary")?.addEventListener("click", async () => {
        const username = document.querySelector("#loginModal input[type='text']").value.trim();
        const password = document.querySelector("#loginModal input[type='password']").value.trim();

        if (!username || !password) return showToast("Заполните все поля!");

        try {
            const response = await authAPI.login(username, password);
            if (response.success) {
                loginModal.hide();
                showToast(`Добро пожаловать, ${username}`);
                setTimeout(() => location.reload(), 800);
            } else {
                showToast(response.message || "Неверный логин или пароль");
            }
        } catch (error) {
            showToast(error.message || "Неверный логин или пароль");
        }
    });

    loginBtn?.addEventListener("click", () => loginModal.show());
    loginBtnClose?.addEventListener("click", () => loginModal.hide());
    registerBtn?.addEventListener("click", () => registerModal.show());
    registerBtnClose?.addEventListener("click", () => registerModal.hide());


    if (document.getElementById("restaurantList")) {
        const list = document.getElementById("restaurantList");
        
        function render(rests) {
            list.innerHTML = "";
            if (rests.length === 0) {
                list.innerHTML = '<div class="col-12"><p class="text-center">Рестораны не найдены</p></div>';
                return;
            }
            rests.forEach(r => {
                list.innerHTML += `
                    <div class="col-md-3 mb-4">
                        <div class="card">
                            <img src="${r.images[0]}" class="card-img-top" style="height:200px;object-fit:cover;" alt="Фотография ресторана ${r.name}">
                            <div class="card-body">
                                <h5 class="card-title">${r.name}</h5>
                                <p>${r.cuisine}, ${r.location}, ${r.price}</p>
                                <a class="btn btn-primary" href="restaurant.html?id=${r.id}" aria-label="Подробнее о ресторане ${r.name}">Подробнее</a>
                            </div>
                        </div>
                    </div>`;
            });
        }

        async function loadRestaurants(filters = {}) {
            try {
                let restaurants;
                if (Object.keys(filters).length === 0 || 
                    (!filters.cuisine && !filters.location && !filters.price)) {
                    restaurants = await restaurantsAPI.getAll();
                } else {
                    restaurants = await restaurantsAPI.search(filters);
                }
                render(restaurants);
            } catch (error) {
                showToast(error.message || "Ошибка загрузки ресторанов");
                console.error(error);
                list.innerHTML = '<div class="col-12"><p class="text-center text-danger">Ошибка загрузки ресторанов</p></div>';
            }
        }

        loadRestaurants();

        document.getElementById("searchBtn")?.addEventListener("click", () => {
            const cuisine = document.getElementById("cuisine").value;
            const location = document.getElementById("location").value;
            const price = document.getElementById("price").value;
            loadRestaurants({ cuisine, location, price });
        });
    }

    const restId = new URLSearchParams(location.search).get("id");
    if (restId) {
        async function loadRestaurantDetails() {
            try {
                const rest = await restaurantsAPI.getById(restId);
                
                document.getElementById("restaurantName").textContent = rest.name;

                const carouselInner = document.getElementById("carouselInner");
                carouselInner.innerHTML = "";
                rest.images.forEach((img, i) => {
                    carouselInner.innerHTML += `
                        <div class="carousel-item ${i === 0 ? "active" : ""}" role="listitem">
                            <img src="${img}" class="d-block w-100" style="height:400px;object-fit:cover;" alt="Фотография ресторана ${rest.name}, изображение ${i + 1} из ${rest.images.length}">
                        </div>`;
                });

                const menuList = document.getElementById("menuList");
                menuList.innerHTML = "";
                rest.menu.forEach(m => menuList.innerHTML += `<li class="list-group-item">${m}</li>`);

                const reviews = document.getElementById("reviewsList");
                reviews.innerHTML = "";
                rest.reviews.forEach(r => {
                    reviews.innerHTML += `
                        <div class="card mb-2">
                            <div class="card-body">
                                <h5>${r.name}</h5>
                                <p>${r.text}</p>
                            </div>
                        </div>`;
                });

            
                document.querySelector("#bookingModal .btn-primary")?.addEventListener("click", async () => {
                    const currentUser = authAPI.getCurrentUser();
                    if (!currentUser) return showToast("Сначала войдите!");

                    const nameInput = document.querySelector("#bookingModal input[type='text']");
                    const emailInput = document.querySelector("#bookingModal input[type='email']");
                    const dateInput = document.querySelector("#bookingModal input[type='date']");
                    const timeInput = document.querySelector("#bookingModal input[type='time']");

                    const name = nameInput.value.trim();
                    const email = emailInput.value.trim();
                    const date = dateInput.value;
                    const time = timeInput.value;

                    if (!name || !email || !date || !time) return showToast("Заполните все поля!");

                    try {
                        const booking = {
                            userId: currentUser.id,
                            restaurantId: rest.id,
                            restaurantName: rest.name,
                            name,
                            email,
                            date,
                            time
                        };

                        await bookingsAPI.create(booking);
                        
                        const modal = bootstrap.Modal.getInstance(document.getElementById("bookingModal"));
                        modal.hide();
                        
                        // Очистка формы
                        nameInput.value = "";
                        emailInput.value = "";
                        dateInput.value = "";
                        timeInput.value = "";
                        
                        showToast("Столик забронирован!");
                    } catch (error) {
                        showToast(error.message || "Ошибка бронирования");
                    }
                });

                document.getElementById("bookBtn")?.addEventListener("click", () => {
                    const currentUser = authAPI.getCurrentUser();
                    if (!currentUser) {
                        showToast("Сначала войдите!");
                        return;
                    }
                    bookingModal.show();
                });
            } catch (error) {
                showToast(error.message || "Ошибка загрузки ресторана");
                console.error(error);
            }
        }

        loadRestaurantDetails();
    }

    if (location.pathname.includes("profile.html")) {
        const currentUser = authAPI.getCurrentUser();
        if (!currentUser) {
            showToast("Сначала войдите!");
            location.href = "index.html";
            return;
        }

        document.getElementById("userInfo").innerHTML = `
            <p><b>Логин:</b> ${currentUser.username}</p>
            <p><b>Email:</b> ${currentUser.email}</p>
        `;

        async function loadBookingHistory() {
            try {
                const bookings = await bookingsAPI.getByUserId(currentUser.id);
                const history = document.getElementById("bookingHistory");
                history.innerHTML = "";
                
                if (!bookings || bookings.length === 0) {
                    history.innerHTML = `<li class="list-group-item">Нет бронирований</li>`;
                } else {
                    bookings.forEach(b => {
                        history.innerHTML += `
                            <li class="list-group-item">
                                ${b.restaurantName} — ${b.date} ${b.time}
                                <button class="btn btn-sm btn-danger float-end" data-booking-id="${b.id}">Удалить</button>
                            </li>`;
                    });
                    
                    // Обработчики удаления бронирований
                    history.querySelectorAll('[data-booking-id]').forEach(btn => {
                        btn.addEventListener('click', async () => {
                            const bookingId = btn.getAttribute('data-booking-id');
                            try {
                                await bookingsAPI.delete(bookingId);
                                showToast("Бронирование отменено");
                                loadBookingHistory();
                            } catch (error) {
                                showToast("Ошибка отмены бронирования");
                            }
                        });
                    });
                }
            } catch (error) {
                showToast(error.message || "Ошибка загрузки истории бронирований");
                console.error(error);
                const history = document.getElementById("bookingHistory");
                history.innerHTML = '<li class="list-group-item text-danger">Ошибка загрузки истории бронирований</li>';
            }
        }

        loadBookingHistory();

        document.getElementById("logoutBtn")?.addEventListener("click", () => {
            authAPI.logout();
            location.href = "index.html";
        });
    }
});
