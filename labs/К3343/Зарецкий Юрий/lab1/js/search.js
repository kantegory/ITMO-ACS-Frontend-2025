// Загрузка данных при инициализации
async function loadProperties(filters = {}) {
    try {
        const apartments = await ApartmentAPI.getApartments(filters);
        const properties = apartments.map(apt => ({
            ...apt,
            image: apt.images && apt.images.length > 0 ? apt.images[0] : "https://via.placeholder.com/400x300?text=Нет+фото"
        }));
        renderProperties(properties);
    } catch (error) {
        console.error('Ошибка загрузки недвижимости:', error);
        renderProperties([]);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Обновляем навигацию после загрузки main.js
    if (typeof updateNavigation === 'function') {
        updateNavigation();
    }
    
    // Загружаем данные
    loadProperties();
});

function renderProperties(properties) {
    const container = document.getElementById('propertiesList');
    container.innerHTML = '';
    document.getElementById('resultsCount').textContent = `Найдено: ${properties.length}`;

    if (properties.length === 0) {
        container.innerHTML = '<div class="col-12"><div class="alert alert-info">Ничего не найдено</div></div>';
        return;
    }

    properties.forEach(property => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4 mb-4';
        col.innerHTML = `
            <div class="card h-100 property-card">
                <img src="${property.image}" class="card-img-top" alt="Фотография недвижимости: ${property.title}, расположена по адресу ${property.location}" style="height: 200px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">${property.title}</h5>
                    <p class="card-text text-muted">${property.location}</p>
                    <p class="card-text property-description">${property.description || ''}</p>
                    <p class="card-text"><strong class="text-primary">${property.price.toLocaleString()} ₽/мес</strong></p>
                    <a href="property.html?id=${property.id}" class="btn btn-primary btn-sm mt-auto">Подробнее</a>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}

async function applyFilters() {
    const searchText = document.getElementById('searchInput').value.trim();
    const propertyType = document.getElementById('propertyType').value;
    const location = document.getElementById('location').value.trim();
    const minPriceValue = document.getElementById('minPrice').value;
    const maxPriceValue = document.getElementById('maxPrice').value;
    const rooms = document.getElementById('rooms').value;

    // Формируем объект фильтров
    const filters = {};
    
    if (searchText) {
        filters.search = searchText;
    }
    if (propertyType) {
        filters.type = propertyType;
    }
    if (location) {
        filters.location = location;
    }
    if (minPriceValue) {
        filters.minPrice = parseInt(minPriceValue);
    }
    if (maxPriceValue) {
        filters.maxPrice = parseInt(maxPriceValue);
    }
    if (rooms) {
        filters.rooms = rooms;
    }

    // Загружаем данные с фильтрами через API
    await loadProperties(filters);
}

async function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('propertyType').value = '';
    document.getElementById('location').value = '';
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.getElementById('rooms').value = '';
    // Загружаем все данные без фильтров
    await loadProperties();
}

