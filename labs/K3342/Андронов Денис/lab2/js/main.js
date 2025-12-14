// ждём, пока страница полностью загрузится
document.addEventListener("DOMContentLoaded", () => {

    // поле ввода для поиска по названию / кухне
    const searchInput = document.getElementById("searchInput");

    // список с районами
    const districtSelect = document.getElementById("districtSelect");

    // список с ценами
    const priceSelect = document.getElementById("priceSelect");

    // контейнер, в который будут рендериться карточки ресторанов
    const listContainer = document.getElementById("restaurants-list");

    // здесь храним все рестораны, полученные с сервера
    let restaurants = [];

    // нормализация строки
    function normalize(str) {
        return String(str ?? '').trim().toLowerCase();
    }

    /**
     * генерация html-карточки ресторана
     * на основе объекта ресторана
     */
    function renderCard(r) {
        return `
        <div class="col-md-4 mb-4 restaurant-item"
             data-id="${r.id}"
             data-name="${normalize(r.name)}"
             data-type="${normalize(r.type)}"
             data-location="${r.location}"
             data-price="${r.price}">

            <div class="card h-100">
                <img src="${r.image}" class="card-img-top" alt="${r.name}">

                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${r.name}</h5>

                    <p class="card-text">
                        ${r.type} • ${r.price} • ${r.location} район
                    </p>

                    <!-- mt-auto прижимает кнопку вниз карточки -->
                    <div class="mt-auto">
                        <a href="restaurant.html?id=${r.id}" class="btn btn-primary">
                            Подробнее
                        </a>
                    </div>
                </div>
            </div>
        </div>`;
    }

    // применение фильтров
    function applyFilters() {
        // значение строки поиска
        const q = normalize(searchInput.value);

        // район
        const district = districtSelect.value;

        // цена
        const price = priceSelect.value;

        // фильтруем массив ресторанов,
        // не трогая оригинальный массив
        const filtered = restaurants.filter(r => {
            const name = normalize(r.name);
            const type = normalize(r.type);

            // совпадение по поиску (если строка не пустая)
            const matchesSearch =
                q === '' || name.includes(q) || type.includes(q);

            // совпадение по району
            const matchesDistrict =
                district === 'Район' || district === '' || r.location === district;

            // совпадение по цене
            const matchesPrice =
                price === 'Цена' || price === '' || r.price === price;

            // ресторан отображается, только пройдя все фильтры
            return matchesSearch && matchesDistrict && matchesPrice;
        });

        // отрисовываем карточки ресторанов
        listContainer.innerHTML = filtered.map(renderCard).join('');
    }

    /**
     * загрузка ресторанов с сервера
     * и их первичная отрисовка
     */
    async function loadAndRender() {
        try {
            // fetchRestaurants - из api.js
            restaurants = await fetchRestaurants();

            // после загрузки сразу применяем фильтры
            applyFilters();
        } catch (e) {
            // сервер недоступен - выводим ошибку
            listContainer.innerHTML =
                `<p class="text-danger">Ошибка загрузки ресторанов</p>`;
            console.error(e);
        }
    }

    // навешиваем обработчики событий
    // список ресторанов обновляется при любом изменении фильтров
    searchInput.addEventListener('input', applyFilters);
    districtSelect.addEventListener('change', applyFilters);
    priceSelect.addEventListener('change', applyFilters);

    // загрузка данных при открытии страницы
    loadAndRender();
});
