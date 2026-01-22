document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const districtSelect = document.getElementById("districtSelect");
    const priceSelect = document.getElementById("priceSelect");
    const items = document.querySelectorAll(".restaurant-item");

    function applyFilters() {
        const searchValue = searchInput.value.toLowerCase();
        const districtValue = districtSelect.value;
        const priceValue = priceSelect.value;

        items.forEach(item => {
            const name = item.dataset.name;
            const type = item.dataset.type;
            const location = item.dataset.location;
            const price = item.dataset.price;

            let visible = true;

            // Поиск по названию или кухне
            if (searchValue && !(name.includes(searchValue) || type.includes(searchValue))) {
                visible = false;
            }

            // Фильтр по району
            if (districtValue !== "Район" && location !== districtValue) {
                visible = false;
            }

            // Фильтр по цене
            if (priceValue !== "Цена" && price !== priceValue) {
                visible = false;
            }

            item.style.display = visible ? "" : "none";
        });
    }

    searchInput.addEventListener("input", applyFilters);
    districtSelect.addEventListener("change", applyFilters);
    priceSelect.addEventListener("change", applyFilters);
});
