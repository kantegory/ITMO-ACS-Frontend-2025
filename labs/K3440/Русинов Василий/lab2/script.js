const API = "http://localhost:3000";
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".rentBtn").forEach(btn => {
        btn.addEventListener("click", async () => {

            const userId = localStorage.getItem("userId");
            if (!userId) {
                alert("Сначала войдите в аккаунт");
                location.href = "login.html";
                return;
            }

            const card = btn.closest(".property-item");

            const rental = {
                userId: userId,
                title: card.querySelector("h5").textContent,
                price: Number(card.dataset.price),
                img: card.querySelector("img").src
            };


            await fetch(`${API}/rentals`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(rental)
            });

            new bootstrap.Modal(
                document.getElementById("rentModal")
            ).show();
        });
    });
});



document.getElementById("filterBtn")?.addEventListener("click", () => {

    const search = document.getElementById("searchInput").value.toLowerCase();
    const type = document.getElementById("typeSelect").value;
    const price = document.getElementById("priceSelect").value;

    document.querySelectorAll(".property-item").forEach(item => {

        const itemLocation = item.dataset.location.toLowerCase();
        const itemType = item.dataset.type;
        const itemPrice = Number(item.dataset.price);

        let ok = true;

        if (search && !itemLocation.includes(search)) ok = false;
        if (type && itemType !== type) ok = false;
        if (price && itemPrice > Number(price)) ok = false;

        item.style.display = ok ? "" : "none";
    });
});
if (location.pathname.includes("register")) {
    regBtn.addEventListener("click", async () => {
        const name = regName.value.trim();
        const email = regEmail.value.trim();
        const password = regPass.value;
        const password2 = regPass2.value;

        if (!name || !email || !password) {
            alert("Заполните все поля");
            return;
        }
        if (password !== password2) {
            alert("Пароли не совпадают");
            return;
        }

        await fetch(`${API}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                email,
                password,
                token: Date.now().toString()
            })
        });

        alert("Регистрация успешна");
        location.href = "login.html";
    });
}



if (location.pathname.includes("login")) {
    loginBtn.addEventListener("click", async () => {
        const email = loginEmail.value.trim();
        const password = loginPass.value;

        const res = await fetch(
            `${API}/users?email=${email}&password=${password}`
        );
        const users = await res.json();

        if (users.length === 1) {
            localStorage.clear(); // ← добавить ПЕРЕД setItem

            localStorage.setItem("token", users[0].token);
            localStorage.setItem("userId", users[0].id);
            location.href = "profile.html";
        } else {
            alert("Неверный email или пароль");
        }
    });
}




if (location.pathname.includes("profile")) {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
        location.href = "login.html";
    }
    const profileName = document.getElementById("profileName");
    const profileEmail = document.getElementById("profileEmail");
    const rentedList = document.getElementById("rentedList");
    fetch(`http://localhost:3000/users/${userId}`)
        .then(r => r.json())
        .then(user => {
            profileName.textContent = user.name;
            profileEmail.textContent = user.email;
        });
    fetch(`${API}/rentals?userId=${userId}`)
        .then(r => r.json())
        .then(rentals => {

            if (rentals.length === 0) {
                rentedList.innerHTML = "<p>У вас пока нет арендованных объектов</p>";
                return;
            }

            rentedList.innerHTML = "";

            rentals.forEach(item => {
                rentedList.innerHTML += `
                <div class="col-md-4">
                    <div class="card property-card">
                        <img src="${item.img}" class="card-img-top">
                        <div class="card-body">
                            <h5>${item.title}</h5>
                            <p>${item.price.toLocaleString()} ₽/мес</p>
                        </div>
                    </div>
                </div>
            `;
            });
        });

}


document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.clear();
    location.href = "login";
});
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

if (localStorage.getItem("theme") === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    themeIcon.setAttribute("href", "sprite.svg#icon-sun");
}

themeToggle.addEventListener("click", () => {
    const dark = document.documentElement.getAttribute("data-theme") === "dark";

    if (dark) {
        document.documentElement.removeAttribute("data-theme");
        localStorage.removeItem("theme");
        themeIcon.setAttribute("href", "sprite.svg#icon-moon");
    } else {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
        themeIcon.setAttribute("href", "sprite.svg#icon-sun");
    }
});
