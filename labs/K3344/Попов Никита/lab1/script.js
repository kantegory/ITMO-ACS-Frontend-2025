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

    const restaurants = [
        { 
            id: "1", name: "Итальянский Ресторан", cuisine: "Итальянская", location: "Центр", price: "₽₽",
            images: ["assets/images/italian.jpg", "assets/images/italian2.jpg"],
            menu: ["Паста Карбонара — 450 ₽", "Маргарита — 350 ₽", "Тирамису — 250 ₽"],
            reviews: [{ name: "Иван", text: "Отличная паста и уютная атмосфера!" }, { name: "Мария", text: "Очень понравились десерты." }]
        },
        { 
            id: "2", name: "Суши Бар", cuisine: "Японская", location: "Север", price: "₽₽₽",
            images: ["assets/images/sushi.jpg"], menu: ["Суши", "Роллы"], reviews: [{ name: "Алексей", text: "Свежие роллы, рекомендую!" }] 
        },
        { 
            id: "3", name: "Русская кухня", cuisine: "Русская", location: "Юг", price: "₽",
            images: ["assets/images/russian.jpg"], menu: ["Щи", "Борщ"], reviews: [{ name: "Светлана", text: "Домашняя кухня, очень вкусно." }] 
        },
        { 
            id: "4", name: "Бургерная", cuisine: "Фастфуд", location: "Восток", price: "₽",
            images: ["assets/images/burger.jpg"], menu: ["Чизбургер", "Картошка фри"], reviews: [{ name: "Пётр", text: "Бургеры сочные и большие." }] 
        }
    ];

    const loginModal = document.getElementById("loginModal") ? new bootstrap.Modal("#loginModal") : null;
    const registerModal = document.getElementById("registerModal") ? new bootstrap.Modal("#registerModal") : null;
    const bookingModal = document.getElementById("bookingModal") ? new bootstrap.Modal("#bookingModal") : null;

    let users = JSON.parse(localStorage.getItem("users") || "[]");
    const loggedUser = sessionStorage.getItem("user");

    const loginBtn = document.getElementById("loginBtn");
    const loginBtnClose = document.getElementById("closeLogin");
    const registerBtn = document.getElementById("registerBtn");
    const registerBtnClose = document.getElementById("closeRegister");
    const headerDiv = document.querySelector("header div");

    if (loggedUser) {
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
            sessionStorage.removeItem("user");
            location.reload();
        });

        headerDiv?.append(profileBtn, logoutBtn);
    }

    document.querySelector("#registerModal .btn-primary")?.addEventListener("click", () => {
        const username = document.querySelector("#registerModal input[type='text']").value.trim();
        const email = document.querySelector("#registerModal input[type='email']").value.trim();
        const password = document.querySelector("#registerModal input[type='password']").value.trim();

        if (!username || !email || !password) return showToast("Заполните все поля!");
        if (users.find(u => u.username === username)) return showToast("Такой пользователь уже существует!");

        const newUser = { username, email, password, bookings: [] };
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        sessionStorage.setItem("user", username);

        registerModal.hide();
        showToast(`Регистрация успешна! Добро пожаловать, ${username}`);
        setTimeout(() => location.reload(), 800);
    });

    document.querySelector("#loginModal .btn-primary")?.addEventListener("click", () => {
        const username = document.querySelector("#loginModal input[type='text']").value.trim();
        const password = document.querySelector("#loginModal input[type='password']").value.trim();

        const user = users.find(u => u.username === username && u.password === password);
        if (!user) return showToast("Неверный логин или пароль");

        sessionStorage.setItem("user", username);
        loginModal.hide();
        showToast(`Добро пожаловать, ${username}`);
        setTimeout(() => location.reload(), 800);
    });

    loginBtn?.addEventListener("click", () => loginModal.show());
    loginBtnClose?.addEventListener("click", () => loginModal.hide());
    registerBtn?.addEventListener("click", () => registerModal.show());
    registerBtnClose?.addEventListener("click", () => registerModal.hide());

    if (document.getElementById("restaurantList")) {
        const list = document.getElementById("restaurantList");
        function render(rests) {
            list.innerHTML = "";
            rests.forEach(r => {
                list.innerHTML += `
                    <div class="col-md-3 mb-4">
                        <div class="card">
                            <img src="${r.images[0]}" class="card-img-top" style="height:200px;object-fit:cover;">
                            <div class="card-body">
                                <h5 class="card-title">${r.name}</h5>
                                <p>${r.cuisine}, ${r.location}, ${r.price}</p>
                                <a class="btn btn-primary" href="restaurant.html?id=${r.id}">Подробнее</a>
                            </div>
                        </div>
                    </div>`;
            });
        }
        render(restaurants);

        document.getElementById("searchBtn")?.addEventListener("click", () => {
            const cuisine = document.getElementById("cuisine").value;
            const location = document.getElementById("location").value;
            const price = document.getElementById("price").value;
            const filtered = restaurants.filter(r =>
                (!cuisine || r.cuisine === cuisine) &&
                (!location || r.location === location) &&
                (!price || r.price === price)
            );
            render(filtered);
        });
    }

    const restId = new URLSearchParams(location.search).get("id");
    if (restId) {
        const rest = restaurants.find(r => r.id === restId);
        if (rest) {
            document.getElementById("restaurantName").textContent = rest.name;

            const carouselInner = document.getElementById("carouselInner");
            rest.images.forEach((img, i) => {
                carouselInner.innerHTML += `
                    <div class="carousel-item ${i === 0 ? "active" : ""}">
                        <img src="${img}" class="d-block w-100" style="height:400px;object-fit:cover;">
                    </div>`;
            });

            const menuList = document.getElementById("menuList");
            rest.menu.forEach(m => menuList.innerHTML += `<li class="list-group-item">${m}</li>`);

            const reviews = document.getElementById("reviewsList");
            rest.reviews.forEach(r => {
                reviews.innerHTML += `
                    <div class="card mb-2">
                        <div class="card-body">
                            <h5>${r.name}</h5>
                            <p>${r.text}</p>
                        </div>
                    </div>`;
            });

            document.querySelector("#bookingModal .btn-primary")?.addEventListener("click", () => {
                const currentUser = sessionStorage.getItem("user");
                if (!currentUser) return showToast("Сначала войдите!");

                const date = document.querySelector("#bookingModal input[type='date']").value;
                const time = document.querySelector("#bookingModal input[type='time']").value;
                if (!date || !time) return showToast("Выберите дату и время!");

                let users = JSON.parse(localStorage.getItem("users") || "[]");
                const user = users.find(u => u.username === currentUser);
                if (!user) return showToast("Пользователь не найден!");

                user.bookings = user.bookings || [];
                user.bookings.push({
                    restaurant: rest.name,
                    date,
                    time
                });

                localStorage.setItem("users", JSON.stringify(users));

                const modal = bootstrap.Modal.getInstance(document.getElementById("bookingModal"));
                modal.hide();
                showToast("Столик забронирован!");
            });

            document.getElementById("bookBtn")?.addEventListener("click", () => bookingModal.show());
        }
    }

    if (location.pathname.includes("profile.html")) {
        const username = sessionStorage.getItem("user");
        if (!username) { showToast("Сначала войдите!"); location.href = "index.html"; return; }

        users = JSON.parse(localStorage.getItem("users") || "[]");
        const user = users.find(u => u.username === username);
        if (!user) { showToast("Пользователь не найден!"); location.href = "index.html"; return; }

        document.getElementById("userInfo").innerHTML = `
            <p><b>Логин:</b> ${user.username}</p>
            <p><b>Email:</b> ${user.email}</p>
        `;

        const history = document.getElementById("bookingHistory");
        history.innerHTML = "";
        if (!user.bookings || user.bookings.length === 0) {
            history.innerHTML = `<li class="list-group-item">Нет бронирований</li>`;
        } else {
            user.bookings.forEach(b => {
                history.innerHTML += `<li class="list-group-item">${b.restaurant} — ${b.date} ${b.time}</li>`;
            });
        }

        document.getElementById("logoutBtn")?.addEventListener("click", () => {
            sessionStorage.removeItem("user");
            location.href = "index.html";
        });
    }
});
