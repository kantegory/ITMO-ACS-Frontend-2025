let currentPropertyId = null;

// загрузка информации об объекте
function loadPropertyDetails() {
    console.log('Начало загрузки деталей объекта...');

    const urlParams = new URLSearchParams(window.location.search);
    currentPropertyId = parseInt(urlParams.get('id'));

    console.log('ID объекта из URL:', currentPropertyId);

    if (!currentPropertyId) {
        alert('Объект не найден');
        window.location.href = 'profile.html';
        return;
    }

    const property = getPropertyById(currentPropertyId);
    console.log('Найденный объект:', property);

    if (!property) {
        alert('Объект не найден');
        window.location.href = 'profile.html';
        return;
    }

    const user = authManager.getCurrentUser();
    console.log('Текущий пользователь:', user);

    if (property.ownerId !== user.id) {
        alert('У вас нет доступа к этому объекту');
        window.location.href = 'profile.html';
        return;
    }

    const titleElement = document.getElementById('propertyTitle');
    const locationElement = document.getElementById('propertyLocation');
    const typeElement = document.getElementById('propertyType');
    const rentalTypeElement = document.getElementById('propertyRentalType');
    const priceElement = document.getElementById('propertyPrice');
    const descriptionElement = document.getElementById('propertyDescription');

    if (titleElement) titleElement.textContent = property.title;
    if (locationElement) locationElement.textContent = property.location;
    if (typeElement) typeElement.textContent = window.propertyTypeMap ? window.propertyTypeMap[property.propertyType] : property.propertyType;
    if (rentalTypeElement) rentalTypeElement.textContent = window.rentalTypeMap ? window.rentalTypeMap[property.rentalType] : property.rentalType;
    if (priceElement) priceElement.textContent = RentEstateApp.formatPrice(property.price);
    if (descriptionElement) descriptionElement.textContent = property.description;

    const propertyImage = document.getElementById('propertyImage');
    if (propertyImage) {
        if (property.images && property.images[0]) {
            propertyImage.src = property.images[0];
            propertyImage.alt = property.title;
        } else {
            propertyImage.src = getPlaceholderImage(property.propertyType);
        }
    }

    const propertyAreaContainer = document.getElementById('propertyAreaContainer');
    const propertyArea = document.getElementById('propertyArea');
    if (propertyArea && property.area) {
        propertyArea.textContent = property.area + ' м²';
        if (propertyAreaContainer) propertyAreaContainer.style.display = 'block';
    } else if (propertyAreaContainer) {
        propertyAreaContainer.style.display = 'none';
    }

    const propertyRoomsContainer = document.getElementById('propertyRoomsContainer');
    const propertyRooms = document.getElementById('propertyRooms');
    if (propertyRooms && property.rooms) {
        propertyRooms.textContent = property.rooms;
        if (propertyRoomsContainer) propertyRoomsContainer.style.display = 'block';
    } else if (propertyRoomsContainer) {
        propertyRoomsContainer.style.display = 'none';
    }

    const amenitiesContainer = document.getElementById('propertyAmenities');
    const amenitiesList = document.getElementById('amenitiesList');
    if (amenitiesList && property.amenities && property.amenities.length > 0) {
        amenitiesList.innerHTML = property.amenities.map(amenity =>
            `<span class="badge bg-light text-dark me-1 mb-1">${amenity}</span>`
        ).join('');
        if (amenitiesContainer) amenitiesContainer.style.display = 'block';
    } else if (amenitiesContainer) {
        amenitiesContainer.style.display = 'none';
    }

    console.log('Информация об объекте загружена');

    loadPropertyApplications();
}

// загрузка заявок на аренду для этого объекта
function loadPropertyApplications() {
    console.log('Загрузка заявок...');

    const content = document.getElementById('propertyApplicationsContent');
    if (!content) {
        console.error('Элемент propertyApplicationsContent не найден');
        return;
    }

    const applications = getApplicationsByOwner(authManager.getCurrentUser().id)
        .filter(app => app.propertyId === currentPropertyId);

    console.log('Найдено заявок:', applications.length);

    const totalElement = document.getElementById('totalApplications');
    const pendingElement = document.getElementById('pendingApplications');
    const approvedElement = document.getElementById('approvedApplications');
    const rejectedElement = document.getElementById('rejectedApplications');

    if (totalElement) totalElement.textContent = applications.length;
    if (pendingElement) pendingElement.textContent = applications.filter(app => app.status === 'pending').length;
    if (approvedElement) approvedElement.textContent = applications.filter(app => app.status === 'approved').length;
    if (rejectedElement) rejectedElement.textContent = applications.filter(app => app.status === 'rejected').length;

    if (applications.length === 0) {
        content.innerHTML = `
            <div class="text-center py-4">
                <i class="bi bi-inbox display-4 text-muted"></i>
                <h5 class="mt-3">Заявок пока нет</h5>
                <p class="text-muted">Новые заявки на аренду этого объекта появятся здесь</p>
            </div>
        `;
        return;
    }

    content.innerHTML = `
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Арендатор</th>
                        <th>Дата начала</th>
                        <th>Срок</th>
                        <th>Стоимость</th>
                        <th>Статус</th>
                        <th>Дата заявки</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    ${applications.map(app => `
                        <tr>
                            <td>
                                <strong>${app.tenantName}</strong><br>
                                <small class="text-muted">${app.tenantPhone}</small><br>
                                <small class="text-muted">${app.tenantEmail}</small>
                            </td>
                            <td>${RentEstateApp.formatDate(app.startDate)}</td>
                            <td>${app.duration} ${app.rentalType === 'daily' ? 'дн.' : 'мес.'}</td>
                            <td>${RentEstateApp.formatPrice(app.totalCost)}</td>
                            <td>
                                <span class="badge ${getStatusClass(app.status)}">
                                    ${window.applicationStatusMap ? window.applicationStatusMap[app.status] : app.status}
                                </span>
                            </td>
                            <td>${RentEstateApp.formatDate(app.applicationDate)}</td>
                            <td>
                                ${app.status === 'pending' ? `
                                    <div class="btn-group btn-group-sm">
                                        <button class="btn btn-success" onclick="approveApplication(${app.id})">
                                            <i class="bi bi-check-lg"></i>
                                        </button>
                                        <button class="btn btn-danger" onclick="rejectApplication(${app.id})">
                                            <i class="bi bi-x-lg"></i>
                                        </button>
                                    </div>
                                ` : `
                                    <span class="text-muted">-</span>
                                `}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// подтверждение заявки
function approveApplication(applicationId) {
    if (updateRentalApplicationStatus(applicationId, 'approved')) {
        loadPropertyApplications();
        alert('Заявка подтверждена!');
    } else {
        alert('Ошибка при подтверждении заявки');
    }
}

// отклонение заявки
function rejectApplication(applicationId) {
    if (updateRentalApplicationStatus(applicationId, 'rejected')) {
        loadPropertyApplications();
        alert('Заявка отклонена!');
    } else {
        alert('Ошибка при отклонении заявки');
    }
}

// функции управления объектом
function editProperty(propertyId) {
    alert(`Редактирование объекта ${propertyId} будет реализовано позже`);
}

function deleteProperty(propertyId) {
    if (confirm('Вы уверены, что хотите удалить этот объект недвижимости?')) {
        alert(`Удаление объекта ${propertyId} будет реализовано позже`);
    }
}

// инициализация страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница деталей объекта загружается...');

    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    console.log('getPropertyById доступен:', typeof window.getPropertyById === 'function');
    console.log('getApplicationsByOwner доступен:', typeof window.getApplicationsByOwner === 'function');
    console.log('propertyTypeMap доступен:', !!window.propertyTypeMap);
    console.log('rentalTypeMap доступен:', !!window.rentalTypeMap);

    loadPropertyDetails();
});

// экспорт глобальных функций
window.editProperty = editProperty;
window.deleteProperty = deleteProperty;
window.approveApplication = approveApplication;
window.rejectApplication = rejectApplication;