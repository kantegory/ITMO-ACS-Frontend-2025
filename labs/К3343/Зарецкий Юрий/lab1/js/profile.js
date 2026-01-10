// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Обновляем навигацию после загрузки main.js
    if (typeof updateNavigation === 'function') {
        updateNavigation();
    }
    
    // Загружаем данные профиля
    loadProfile();
});

// Проверка авторизации
async function checkAuth() {
    await UserService.loadUsers();
    const currentUser = UserService.getCurrentUser();
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return false;
    }
    
    return true;
}

function logout() {
    UserService.logout();
    window.location.href = 'index.html';
}

function renderPropertyCard(property, containerId) {
    const container = document.getElementById(containerId);
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4 mb-4';
    const image = property.images && property.images.length > 0 
        ? property.images[0] 
        : "https://via.placeholder.com/300x200?text=Нет+фото";
    col.innerHTML = `
        <div class="card h-100">
            <img src="${image}" class="card-img-top" alt="Фотография недвижимости: ${property.title}, расположена по адресу ${property.location}" style="height: 200px; object-fit: cover;">
            <div class="card-body">
                <h5 class="card-title">${property.title}</h5>
                <p class="card-text text-muted">${property.location}</p>
                <p class="card-text"><strong>${property.price.toLocaleString()} ₽/мес</strong></p>
                <p class="card-text"><span class="badge bg-success">Активна</span></p>
                <a href="property.html?id=${property.id}" class="btn btn-primary btn-sm">Подробнее</a>
            </div>
        </div>
    `;
    container.appendChild(col);
}

// Загрузка данных профиля
async function loadProfile() {
    if (!await checkAuth()) {
        return;
    }

    const currentUser = UserService.getCurrentUser();
    
    // Заполнение информации о пользователе
    document.getElementById('userName').textContent = currentUser.fullName;
    document.getElementById('userEmail').textContent = currentUser.email;
    document.getElementById('userPhone').textContent = currentUser.phone;

    // Загрузка недвижимости
    await ApartmentService.loadApartments();
    
    // Недвижимость, которую пользователь сдает
    const rentingProperties = await ApartmentService.getUserApartments(currentUser.id);
    const rentingContainer = document.getElementById('rentingProperties');
    rentingContainer.innerHTML = '';
    
    if (rentingProperties.length === 0) {
        rentingContainer.innerHTML = '<div class="col-12"><div class="alert alert-info">У вас нет недвижимости для сдачи</div></div>';
    } else {
        rentingProperties.forEach(prop => renderPropertyCard(prop, 'rentingProperties'));
    }

    // Арендованная недвижимость
    const rentedData = await ApartmentService.getRentedApartments(currentUser.id);
    const rentedContainer = document.getElementById('rentedProperties');
    rentedContainer.innerHTML = '';
    
    if (rentedData.length === 0) {
        rentedContainer.innerHTML = '<div class="col-12"><div class="alert alert-info">Вы еще не арендовали недвижимость</div></div>';
    } else {
        for (const rent of rentedData) {
            // Проверяем, что apartmentId существует
            if (!rent.apartmentId) {
                console.warn('Запись об аренде без apartmentId:', rent);
                continue;
            }
            const apartment = await ApartmentService.getApartmentById(rent.apartmentId);
            if (apartment) {
                const col = document.createElement('div');
                col.className = 'col-md-6 col-lg-4 mb-4';
                const image = apartment.images && apartment.images.length > 0 
                    ? apartment.images[0] 
                    : "https://via.placeholder.com/300x200?text=Нет+фото";
                
                // Форматируем даты
                const formattedStartDate = DateUtils.formatDate(rent.startDate);
                const formattedEndDate = DateUtils.formatDate(rent.endDate);
                
                col.innerHTML = `
                    <div class="card h-100">
                        <img src="${image}" class="card-img-top" alt="Фотография арендованной недвижимости: ${apartment.title}, расположена по адресу ${apartment.location}, арендована с ${formattedStartDate} по ${formattedEndDate}" style="height: 200px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">${apartment.title}</h5>
                            <p class="card-text text-muted">${apartment.location}</p>
                            <p class="card-text"><strong>${apartment.price.toLocaleString()} ₽/мес</strong></p>
                            <p class="card-text"><span class="badge bg-info">Арендована</span></p>
                            <p class="card-text small text-muted">С ${formattedStartDate} по ${formattedEndDate}</p>
                            <a href="property.html?id=${apartment.id}" class="btn btn-primary btn-sm">Подробнее</a>
                        </div>
                    </div>
                `;
                rentedContainer.appendChild(col);
            }
        }
    }
}

