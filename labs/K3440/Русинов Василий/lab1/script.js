document.getElementById("loginBtn")?.addEventListener("click", () => {
    window.location.href = "profile.html";
});

document.getElementById("regBtn")?.addEventListener("click", () => {
    window.location.href = "login.html";
});

document.querySelectorAll(".rentBtn").forEach(btn => {
    btn.addEventListener("click", () => {
        let modal = new bootstrap.Modal(document.getElementById("rentModal"));
        modal.show();
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
document.getElementById("regBtn")?.addEventListener("click", () => {

    let name = document.getElementById("regName").value.trim();
    let email = document.getElementById("regEmail").value.trim();
    let pass = document.getElementById("regPass").value;
    let pass2 = document.getElementById("regPass2").value;

    if (!name || !email || !pass) {
        alert("Заполните все поля!");
        return;
    }

    if (pass !== pass2) {
        alert("Пароли не совпадают!");
        return;
    }

    const user = {
        name,
        email,
        pass
    };

    localStorage.setItem("user", JSON.stringify(user));

    alert("Регистрация успешна!");
    window.location.href = "login.html";
});


document.getElementById("loginBtn")?.addEventListener("click", () => {

    let email = document.getElementById("loginEmail").value.trim();
    let pass = document.getElementById("loginPass").value;

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("Сначала зарегистрируйтесь!");
        return;
    }

    if (email === user.email && pass === user.pass) {
        localStorage.setItem("logged", "1");
        window.location.href = "profile.html";
    } else {
        alert("Неверный email или пароль!");
    }
});


if (window.location.pathname.includes("profile.html")) {

    const logged = localStorage.getItem("logged");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!logged || !user) {
        window.location.href = "login.html";
    } else {
        document.getElementById("profileName").innerText = user.name;
        document.getElementById("profileEmail").innerText = user.email;
    }
}

document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("logged");
});
