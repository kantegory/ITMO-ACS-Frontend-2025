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
