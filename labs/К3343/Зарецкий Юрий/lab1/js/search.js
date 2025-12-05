let allProperties = [];
let filteredProperties = [];

// Загрузка данных при инициализации
async function loadProperties() {
    await ApartmentService.loadApartments();
    allProperties = ApartmentService.getApartments().map(apt => ({
        ...apt,
        image: apt.images && apt.images.length > 0 ? apt.images[0] : "https://via.placeholder.com/400x300?text=Нет+фото"
    }));
    filteredProperties = [...allProperties];
    renderProperties(filteredProperties);
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
                    <p class="card-text">${property.description}</p>
                    <p class="card-text"><strong class="text-primary">${property.price.toLocaleString()} ₽/мес</strong></p>
                    <a href="property.html?id=${property.id}" class="btn btn-primary btn-sm">Подробнее</a>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}

function applyFilters() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const propertyType = document.getElementById('propertyType').value;
    const location = document.getElementById('location').value.toLowerCase();
    const minPrice = parseInt(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseInt(document.getElementById('maxPrice').value) || Infinity;
    const rooms = document.getElementById('rooms').value;

    filteredProperties = allProperties.filter(property => {
        const matchesSearch = !searchText || 
            property.title.toLowerCase().includes(searchText) ||
            property.location.toLowerCase().includes(searchText);
        const matchesType = !propertyType || property.type === propertyType;
        const matchesLocation = !location || property.location.toLowerCase().includes(location);
        const matchesPrice = property.price >= minPrice && property.price <= maxPrice;
        const matchesRooms = !rooms || property.rooms.toString() === rooms;

        return matchesSearch && matchesType && matchesLocation && matchesPrice && matchesRooms;
    });

    renderProperties(filteredProperties);
}

function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('propertyType').value = '';
    document.getElementById('location').value = '';
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.getElementById('rooms').value = '';
    filteredProperties = [...allProperties];
    renderProperties(filteredProperties);
}

