// редактирование профиля
function editProfile() {
    const user = authManager.getCurrentUser();
    document.getElementById('editUsername').value = user.username;
    document.getElementById('editEmail').value = user.email;

    const modal = new bootstrap.Modal(document.getElementById('editProfileModal'));
    modal.show();
}

// сохранение профиля
function saveProfile() {
    const username = document.getElementById('editUsername').value;
    const email = document.getElementById('editEmail').value;

    alert('Функция сохранения профиля будет реализована позже');

    const modal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'));
    modal.hide();
}

// загрузка вкладки "Мои аренды"
function loadMyRentals() {
    const content = document.getElementById('myRentalsContent');
    const user = authManager.getCurrentUser();
    const applications = getApplicationsByTenant(user.id);

    if (applications.length === 0) {
        content.innerHTML = `
            <div class="text-center py-4">
                <h5>У вас пока нет заявок на аренду</h5>
                <p class="text-muted">Найдите подходящую недвижимость и отправьте заявку на аренду</p>
                <a href="../../index.html" class="btn btn-primary">Найти недвижимость</a>
            </div>
        `;
        return;
    }

    content.innerHTML = `
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Недвижимость</th>
                        <th>Дата начала</th>
                        <th>Срок</th>
                        <th>Стоимость</th>
                        <th>Статус</th>
                        <th>Дата заявки</th>
                    </tr>
                </thead>
                <tbody>
                    ${applications.map(app => `
                        <tr>
                            <td>
                                <strong>${app.propertyTitle}</strong><br>
                                <small class="text-muted">${app.propertyAddress}</small>
                            </td>
                            <td>${RentEstateApp.formatDate(app.startDate)}</td>
                            <td>${app.duration} ${app.rentalType === 'daily' ? 'дн.' : 'мес.'}</td>
                            <td>${RentEstateApp.formatPrice(app.totalCost)}</td>
                            <td>
                                <span class="badge ${getStatusClass(app.status)}">
                                    ${applicationStatusMap[app.status]}
                                </span>
                            </td>
                            <td>${RentEstateApp.formatDate(app.applicationDate)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// загрузка вкладки "Сдаю в аренду"
function loadMyProperties() {
    const content = document.getElementById('myPropertiesContent');
    const user = authManager.getCurrentUser();
    const myProperties = getPropertiesByOwner(user.id);
    const applications = getApplicationsByOwner(user.id);
    const pendingApplications = applications.filter(app => app.status === 'pending');

    const addPropertyButton = `
        <div class="d-grid mb-4">
            <a href="add-property.html" class="btn btn-success btn-lg">
                <i class="bi bi-plus-circle"></i> Добавить объект недвижимости
            </a>
        </div>
    `;

    let propertiesHTML = '';

    if (myProperties.length === 0) {
        propertiesHTML = `
            ${addPropertyButton}
            <div class="alert alert-info text-center">
                <i class="bi bi-house display-4 text-muted d-block mb-3"></i>
                <h6>У вас нет объектов для аренды</h6>
                <p class="mb-3">Добавьте свой первый объект недвижимости, чтобы начать сдавать его в аренду.</p>
            </div>
        `;
    } else {
        propertiesHTML = `
            ${addPropertyButton}
            <h6 class="mb-3">Мои объекты недвижимости</h6>
            <div class="row">
                ${myProperties.map(property => {
            const imageUrl = property.images && property.images[0] ? property.images[0] : getPlaceholderImage(property.propertyType);
            const propertyTypeText = propertyTypeMap[property.propertyType] || 'Недвижимость';

            return `
                        <div class="col-md-6 col-lg-4 mb-4">
                            <div class="card property-card h-100">
                                <div class="property-image-container">
                                    <img src="${imageUrl}" class="card-img-top property-image" alt="${property.title}"
                                         style="height: 200px; object-fit: cover;"
                                         onerror="this.src='${getPlaceholderImage(property.propertyType)}'">
                                    <span class="badge property-type-badge">
                                        ${propertyTypeText}
                                    </span>
                                </div>
                                <div class="card-body d-flex flex-column">
                                    <h5 class="card-title">${property.title}</h5>
                                    <p class="card-text text-muted mb-2">
                                        <i class="bi bi-geo-alt"></i> ${property.location}
                                    </p>
                                    <p class="card-text mb-2">
                                        <strong>${RentEstateApp.formatPrice(property.price)}</strong>
                                        <span class="text-muted">/${property.rentalType === 'daily' ? 'день' : 'мес'}</span>
                                    </p>
                                    <div class="mt-auto">
                                        <div class="d-grid">
                                            <a href="property-details.html?id=${property.id}" class="btn btn-primary">
                                                <i class="bi bi-eye"></i> Детали и управление
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
        }).join('')}
            </div>
        `;
    }

    let applicationsHTML = '';

    if (pendingApplications.length === 0) {
        applicationsHTML = `
            <div class="alert alert-info mt-4">
                <h6>Нет заявок на подтверждение</h6>
                <p class="mb-0">Новые заявки на аренду ваших объектов будут отображаться здесь.</p>
            </div>
        `;
    } else {
        applicationsHTML = `
            <h6 class="mt-4">Заявки на аренду</h6>
            <div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Недвижимость</th>
                            <th>Арендатор</th>
                            <th>Дата начала</th>
                            <th>Срок</th>
                            <th>Стоимость</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${pendingApplications.map(app => `
                            <tr>
                                <td>
                                    <strong>${app.propertyTitle}</strong><br>
                                    <small class="text-muted">${app.propertyAddress}</small>
                                </td>
                                <td>
                                    ${app.tenantName}<br>
                                    <small class="text-muted">${app.tenantPhone}</small>
                                </td>
                                <td>${RentEstateApp.formatDate(app.startDate)}</td>
                                <td>${app.duration} ${app.rentalType === 'daily' ? 'дн.' : 'мес.'}</td>
                                <td>${RentEstateApp.formatPrice(app.totalCost)}</td>
                                <td>
                                    <div class="btn-group btn-group-sm">
                                        <button class="btn btn-success" onclick="approveApplication(${app.id})">
                                            <i class="bi bi-check-lg"></i> Подтвердить
                                        </button>
                                        <button class="btn btn-danger" onclick="rejectApplication(${app.id})">
                                            <i class="bi bi-x-lg"></i> Отклонить
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    content.innerHTML = propertiesHTML + applicationsHTML;
}

// подтверждение заявки
function approveApplication(applicationId) {
    if (updateRentalApplicationStatus(applicationId, 'approved')) {
        loadMyProperties();
        alert('Заявка подтверждена!');
    }
}

// отклонение заявки
function rejectApplication(applicationId) {
    if (updateRentalApplicationStatus(applicationId, 'rejected')) {
        loadMyProperties();
        alert('Заявка отклонена!');
    }
}

// обновление информации о пользователе
function updateUserInfo() {
    const user = authManager.getCurrentUser();
    document.getElementById('userAvatar').textContent = user.username.charAt(0).toUpperCase();
    document.getElementById('userUsername').textContent = user.username;
    document.getElementById('userEmail').textContent = user.email;
}

// обработка страницы профиля
document.addEventListener('DOMContentLoaded', function() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    updateUserInfo();
    loadMyRentals();
    loadMyProperties();

    // обработка переключения вкладок
    const rentalTabs = document.getElementById('rentalTabs');
    if (rentalTabs) {
        rentalTabs.addEventListener('shown.bs.tab', function(event) {
            if (event.target.id === 'my-rentals-tab') {
                loadMyRentals();
            } else if (event.target.id === 'my-properties-tab') {
                loadMyProperties();
            }
        });
    }
});

// экспорт глобальных функций
window.editProfile = editProfile;
window.saveProfile = saveProfile;
window.approveApplication = approveApplication;
window.rejectApplication = rejectApplication;