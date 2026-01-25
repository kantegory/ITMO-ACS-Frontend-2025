import {
    getCurrentUserApi,
    updateUser,
    isAuthenticated,
    getCurrentUser as getCurrentUserFromApi,
    setCurrentUser as setCurrentUserInApi
} from './api.js';
import {authManager} from './auth.js';
import {
    getUserProperties,
    propertyTypeMap,
    rentalTypeMap,
    deleteProperty as deletePropertyApi,
    getPlaceholderImage as getPropertyPlaceholderImage
} from './properties.js';

window.editProfile = editProfile;
window.saveProfile = saveProfile;
window.approveApplication = approveApplication;
window.rejectApplication = rejectApplication;
window.logout = logout;
window.editProperty = editProperty;
window.deleteProperty = deleteProperty;

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Profile page loaded');

    if (!isAuthenticated()) {
        console.log('Not authenticated, redirecting to login');
        window.location.href = 'login.html';
        return;
    }

    try {
        console.log('Fetching current user from API...');
        const user = await getCurrentUserApi();

        if (!user) {
            console.error('No user data received');
            window.location.href = 'login.html';
            return;
        }

        console.log('User data loaded:', user);

        updateUserInfo(user);

        setCurrentUserInApi(user);
        authManager.setCurrentUser(user);

        setupTabSwitching();

        await loadTabData('my-rentals-tab', user.id);

    } catch (error) {
        console.error('Error loading profile:', error);

        const localUser = getCurrentUserFromApi() || authManager.getCurrentUser();
        if (localUser) {
            console.log('Using local user data:', localUser);
            updateUserInfo(localUser);
            setupTabSwitching();
            await loadTabData('my-rentals-tab', localUser.id);
        } else {
            window.location.href = 'login.html';
        }
    }
});

function updateUserInfo(user) {
    if (!user) {
        console.error('No user provided to updateUserInfo');
        return;
    }

    console.log('Updating UI with user:', user);

    const avatarEl = document.getElementById('userAvatar');
    if (avatarEl && user.username) {
        avatarEl.textContent = user.username.charAt(0).toUpperCase();
    }

    const usernameEls = [
        document.getElementById('userUsername'),
        document.getElementById('userUsername2')
    ].filter(Boolean);

    usernameEls.forEach(el => {
        if (el) el.textContent = user.username;
    });

    const emailEls = [
        document.getElementById('userEmail'),
        document.getElementById('userEmail2')
    ].filter(Boolean);

    emailEls.forEach(el => {
        if (el) el.textContent = user.email;
    });

    const phoneEl = document.getElementById('userPhone');
    if (phoneEl) {
        phoneEl.textContent = user.phone || 'Не указан';
    }

    const roleEl = document.getElementById('userRole');
    if (roleEl) {
        roleEl.textContent = user.role === 'ADMIN' ? 'Администратор' : 'Пользователь';
    }

    updateUserStats(user);

    console.log('UI updated successfully');
}

function updateUserStats(user) {
    const statsEl = document.getElementById('userStats');
    if (!statsEl) return;

    statsEl.innerHTML = `
        <div class="row text-center">
            <div class="col-6 border-end">
                <div class="h4 mb-1" id="propertiesCount">0</div>
                <div class="text-muted small">Объектов</div>
            </div>
            <div class="col-6">
                <div class="h4 mb-1" id="rentalsCount">0</div>
                <div class="text-muted small">Аренд</div>
            </div>
        </div>
    `;
}

function editProfile() {
    console.log('Edit profile clicked');

    const user = getCurrentUserFromApi() || authManager.getCurrentUser();
    if (!user) {
        alert('Пользователь не найден. Пожалуйста, войдите снова.');
        window.location.href = 'login.html';
        return;
    }

    const usernameInput = document.getElementById('editUsername');
    const emailInput = document.getElementById('editEmail');
    const phoneInput = document.getElementById('editPhone');
    const passwordInput = document.getElementById('editPassword');

    if (usernameInput) usernameInput.value = user.username;
    if (emailInput) emailInput.value = user.email;
    if (phoneInput) phoneInput.value = user.phone || '';
    if (passwordInput) passwordInput.value = '';

    const modalElement = document.getElementById('editProfileModal');
    if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    } else {
        console.error('Modal element not found');
    }
}

async function saveProfile() {
    console.log('Save profile clicked');

    const user = getCurrentUserFromApi() || authManager.getCurrentUser();
    if (!user) {
        alert('Пользователь не найден. Пожалуйста, войдите снова.');
        window.location.href = 'login.html';
        return;
    }

    const username = document.getElementById('editUsername')?.value.trim();
    const email = document.getElementById('editEmail')?.value.trim();
    const phone = document.getElementById('editPhone')?.value.trim();
    const password = document.getElementById('editPassword')?.value.trim();

    if (!username || !email) {
        alert('Имя пользователя и email обязательны для заполнения');
        return;
    }

    try {
        const updateData = {};

        if (username !== user.username) updateData.username = username;
        if (email !== user.email) updateData.email = email;
        if (phone !== (user.phone || '')) updateData.phone = phone;
        if (password) updateData.password = password;

        if (Object.keys(updateData).length > 0) {
            console.log('Updating user with data:', updateData);

            const updatedUser = await updateUser(user.id, updateData);

            if (!updatedUser) {
                throw new Error('Не удалось обновить профиль');
            }

            console.log('User updated successfully:', updatedUser);

            setCurrentUserInApi(updatedUser);
            authManager.setCurrentUser(updatedUser);

            updateUserInfo(updatedUser);

            const modal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'));
            if (modal) {
                modal.hide();
            }

            showSuccessMessage('Профиль успешно обновлен!');

        } else {
            showInfoMessage('Нет изменений для сохранения');
        }

    } catch (error) {
        console.error('Error updating profile:', error);
        showErrorMessage('Ошибка при обновлении профиля: ' + (error.message || 'Неизвестная ошибка'));
    }
}

async function loadTabData(tabId, userId) {
    console.log('Loading data for tab:', tabId, 'user:', userId);

    const loadingHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Загрузка...</span>
            </div>
            <p class="mt-3">Загрузка...</p>
        </div>
    `;

    if (tabId === 'my-rentals-tab') {
        const content = document.getElementById('myRentalsContent');
        if (content) content.innerHTML = loadingHTML;
        await loadMyRentals(userId);
    } else if (tabId === 'my-properties-tab') {
        const content = document.getElementById('myPropertiesContent');
        if (content) content.innerHTML = loadingHTML;
        await loadMyProperties(userId);
    }
}

async function loadMyRentals(userId) {
    console.log('Loading rentals for user:', userId);
    const content = document.getElementById('myRentalsContent');

    if (!content) return;

    try {
        const rentals = [];

        if (!rentals || rentals.length === 0) {
            content.innerHTML = `
                <div class="text-center py-4">
                    <div class="mb-3">
                        <svg class="icon display-4 text-muted" aria-hidden="true">
                            <use href="../assets/icons.svg#icon-journal-check"></use>
                        </svg>
                    </div>
                    <h5>У вас пока нет заявок на аренду</h5>
                    <p class="text-muted">Найдите подходящую недвижимость и отправьте заявку на аренду</p>
                    <a href="../index.html" class="btn btn-primary">
                        <svg class="icon" aria-hidden="true">
                            <use href="../assets/icons.svg#icon-search"></use>
                        </svg>
                        Найти недвижимость
                    </a>
                </div>
            `;
            return;
        }

        content.innerHTML = `
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead class="table-light">
                        <tr>
                            <th>Объект</th>
                            <th>Дата начала</th>
                            <th>Срок</th>
                            <th>Стоимость</th>
                            <th>Статус</th>
                            <th>Дата заявки</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rentals.map(rental => `
                            <tr>
                                <td>
                                    <strong>${escapeHtml(rental.propertyTitle)}</strong><br>
                                    <small class="text-muted">${escapeHtml(rental.propertyAddress)}</small>
                                </td>
                                <td>${formatDate(rental.startDate)}</td>
                                <td>${rental.duration} ${getRentalTypeText(rental.rentalType)}</td>
                                <td>${formatPrice(rental.totalCost)}</td>
                                <td>
                                    <span class="badge ${getStatusClass(rental.status)}">
                                        ${getStatusText(rental.status)}
                                    </span>
                                </td>
                                <td>${formatDate(rental.applicationDate)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

    } catch (error) {
        console.error('Error loading rentals:', error);
        content.innerHTML = `
            <div class="alert alert-danger">
                <h6>Ошибка загрузки заявок</h6>
                <p class="mb-0">${error.message || 'Не удалось загрузить ваши заявки на аренду'}</p>
            </div>
        `;
    }
}

async function loadMyProperties(userId) {
    console.log('Loading properties for user:', userId);
    const content = document.getElementById('myPropertiesContent');

    if (!content) return;

    try {
        const userProperties = await getUserProperties(userId);

        let propertiesHTML = '';

        if (!userProperties || userProperties.length === 0) {
            propertiesHTML = `
                <div class="text-center py-4">
                    <div class="mb-3">
                        <svg class="icon me-2" aria-hidden="true">
                            <use href="../assets/icons.svg#icon-houses"></use>
                        </svg>
                    </div>
                    <h5>У вас нет объектов недвижимости</h5>
                    <p class="text-muted mb-4">Добавьте свой первый объект, чтобы начать сдавать его в аренду</p>
                    <a href="../pages/add-property.html" class="btn btn-success btn-lg">
                        <svg class="icon me-2" aria-hidden="true">
                            <use href="../assets/icons.svg#icon-plus-circle"></use>
                        </svg> 
                        Добавить объект недвижимости
                    </a>
                </div>
            `;
        } else {
            document.getElementById('propertiesCount').textContent = userProperties.length;

            propertiesHTML = `
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h5 class="mb-0">Мои объекты недвижимости</h5>
                        <p class="text-muted mb-0 small">Всего: ${userProperties.length} объектов</p>
                    </div>
                    <a href="add-property.html" class="btn btn-success">
                        <svg class="icon me-2" aria-hidden="true">
                            <use href="../assets/icons.svg#icon-plus-circle"></use>
                        </svg>
                        Добавить еще
                    </a>
                </div>
                <div class="row">
                    ${userProperties.map(property => {
                const imageUrl = (property.images && property.images[0]) ?
                    property.images[0] : getPropertyPlaceholderImage(property.propertyType);
                const propertyTypeText = propertyTypeMap[property.propertyType] || 'Недвижимость';
                const rentalTypeText = rentalTypeMap[property.rentalType] || property.rentalType;
                const shortDescription = property.description ?
                    (property.description.length > 100 ?
                        property.description.substring(0, 100) + '...' :
                        property.description) :
                    'Без описания';

                return `
                            <div class="col-md-6 col-lg-4 mb-4">
                                <div class="card property-card h-100 shadow-sm hover-shadow">
                                    <div class="property-image-container position-relative" style="height: 200px; overflow: hidden;">
                                        <img src="${imageUrl}" class="card-img-top property-image" alt="${escapeHtml(property.title)}"
                                             style="height: 100%; width: 100%; object-fit: cover;"
                                             onerror="this.onerror=null; this.src='${getPropertyPlaceholderImage(property.propertyType)}';">
                                        <span class="badge bg-primary position-absolute top-0 start-0 m-2">${propertyTypeText}</span>
                                        <span class="badge bg-success position-absolute top-0 end-0 m-2">${rentalTypeText}</span>
                                        ${property.ownerId === userId ? `
                                            <span class="badge bg-info position-absolute bottom-0 start-0 m-2">Ваш объект</span>
                                        ` : ''}
                                    </div>
                                    <div class="card-body d-flex flex-column">
                                        <h5 class="card-title">${escapeHtml(property.title)}</h5>
                                        <p class="card-text text-muted small flex-grow-1">${escapeHtml(shortDescription)}</p>
                                        <div class="mt-3">
                                            <p class="mb-1"><svg class="icon me-2" aria-hidden="true"><use href="../assets/icons.svg#icon-geo"></use></svg> ${escapeHtml(property.location || 'Не указано')}</p>
                                            <div class="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
                                                <div>
                                                    <span class="price-tag fw-bold text-primary">${formatPrice(property.price)}</span>
                                                    <span class="text-muted small ms-1">/ ${getRentalPeriodText(property.rentalType)}</span>
                                                </div>
                                                <div class="btn-group property-actions">
                                                    <a href="../index.html?property=${property.id}"
                                                        class="btn btn-outline-primary d-flex align-items-center justify-content-center"
                                                        title="Посмотреть на сайте"
                                                        target="_blank">
                                                        <svg class="icon" aria-hidden="true">
                                                            <use href="../assets/icons.svg#icon-eye"></use>
                                                        </svg>
    <                                               </a>
                                                    <button class="btn btn-outline-warning d-flex align-items-center justify-content-center"
                                                            onclick="editProperty(${property.id})"
                                                            title="Редактировать">
                                                        <svg class="icon" aria-hidden="true">
                                                            <use href="../assets/icons.svg#icon-pencil"></use>
                                                        </svg>
                                                    </button>
                                                    <button class="btn btn-outline-danger d-flex align-items-center justify-content-center"
                                                            onclick="deleteProperty(${property.id})"
                                                            title="Удалить">
                                                        <svg class="icon" aria-hidden="true">
                                                            <use href="../assets/icons.svg#icon-trash"></use>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
            }).join('')}
                </div>
                
                <div class="card mt-4">
                    <div class="card-body">
                        <h6>
                            <svg class="icon me-2" aria-hidden="true">
                                <use href="../assets/icons.svg#icon-bar-chart"></use>
                            </svg>
                            Статистика по объектам</h6>
                        <div class="row text-center">
                            <div class="col-4">
                                <div class="h4 text-primary mb-1">${userProperties.length}</div>
                                <div class="text-muted small">Всего объектов</div>
                            </div>
                            <div class="col-4">
                                <div class="h4 text-success mb-1">${userProperties.filter(p => p.rentalType === 'monthly').length}</div>
                                <div class="text-muted small">Помесячная аренда</div>
                            </div>
                            <div class="col-4">
                                <div class="h4 text-info mb-1">${userProperties.filter(p => p.rentalType === 'daily').length}</div>
                                <div class="text-muted small">Посуточная аренда</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        content.innerHTML = propertiesHTML;

    } catch (error) {
        console.error('Error loading user properties:', error);
        content.innerHTML = `
            <div class="alert alert-danger">
                <h6>Ошибка загрузки объектов</h6>
                <p class="mb-0">${error.message || 'Не удалось загрузить ваши объекты недвижимости'}</p>
            </div>
            <div class="d-grid mt-3">
                <a href="add-property.html" class="btn btn-success">
                    <svg class="icon me-2" aria-hidden="true">
                        <use href="../assets/icons.svg#icon-plus-circle"></use>
                    </svg>
                    Добавить объект недвижимости
                </a>
            </div>
        `;
    }
}

function approveApplication(applicationId) {
    console.log('Approve application:', applicationId);
    showSuccessMessage('Заявка подтверждена!');

    const user = getCurrentUserFromApi() || authManager.getCurrentUser();
    if (user) {
        loadMyRentals(user.id);
    }
}

function rejectApplication(applicationId) {
    console.log('Reject application:', applicationId);
    showInfoMessage('Заявка отклонена');

    const user = getCurrentUserFromApi() || authManager.getCurrentUser();
    if (user) {
        loadMyRentals(user.id);
    }
}

function setupTabSwitching() {
    console.log('Setting up tab switching');

    const rentalTabs = document.getElementById('rentalTabs');
    if (!rentalTabs) {
        console.warn('Tab container not found');
        return;
    }

    rentalTabs.addEventListener('shown.bs.tab', async function (event) {
        const user = getCurrentUserFromApi() || authManager.getCurrentUser();
        if (!user) return;

        console.log('Tab switched:', event.target.id);
        await loadTabData(event.target.id, user.id);
    });
}

function editProperty(propertyId) {
    console.log('Edit property:', propertyId);
    showInfoMessage(`Редактирование объекта ${propertyId} - функционал в разработке`);
}

async function deleteProperty(propertyId) {
    console.log('Delete property:', propertyId);

    if (!confirm('Вы уверены, что хотите удалить этот объект? Это действие нельзя отменить.')) {
        return;
    }

    try {
        await deletePropertyApi(propertyId);
        showSuccessMessage('Объект успешно удален');

        const user = getCurrentUserFromApi() || authManager.getCurrentUser();
        if (user) {
            await loadMyProperties(user.id);
        }
    } catch (error) {
        console.error('Error deleting property:', error);
        showErrorMessage(`Ошибка удаления объекта: ${error.message}`);
    }
}

function logout() {
    console.log('Logout clicked');
    authManager.logout();
}

function formatPrice(num) {
    if (num == null || Number.isNaN(Number(num))) return '—';
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0
    }).format(Number(num));
}

function formatDate(dateString) {
    if (!dateString) return '—';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    } catch {
        return dateString;
    }
}

function getRentalTypeText(rentalType) {
    return rentalTypeMap[rentalType] || rentalType;
}

function getRentalPeriodText(rentalType) {
    switch (rentalType) {
        case 'daily':
            return 'день';
        case 'monthly':
            return 'месяц';
        case 'yearly':
            return 'год';
        default:
            return 'период';
    }
}

function getStatusClass(status) {
    switch (status) {
        case 'pending':
            return 'bg-warning';
        case 'approved':
            return 'bg-success';
        case 'rejected':
            return 'bg-danger';
        case 'cancelled':
            return 'bg-secondary';
        default:
            return 'bg-light text-dark';
    }
}

function getStatusText(status) {
    const statusMap = {
        'pending': 'На рассмотрении',
        'approved': 'Подтверждено',
        'rejected': 'Отклонено',
        'cancelled': 'Отменено'
    };
    return statusMap[status] || status;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showSuccessMessage(text) {
    showMessage(text, 'success');
}

function showErrorMessage(text) {
    showMessage(text, 'danger');
}

function showInfoMessage(text) {
    showMessage(text, 'info');
}

function showMessage(text, type = 'info') {
    let messageContainer = document.getElementById('profileMessages');
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.id = 'profileMessages';
        messageContainer.className = 'position-fixed top-0 end-0 p-3';
        messageContainer.style.zIndex = '1060';
        document.body.appendChild(messageContainer);
    }

    const toastId = 'toast-' + Date.now();
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = `toast show align-items-center text-white bg-${type} border-0`;
    toast.role = 'alert';
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <svg class="icon me-2">
                    <use href="#icon-${type === 'success' ? 'check-circle' : type === 'danger' ? 'exclamation-circle' : 'info-circle'}"></use>
                </svg>
                ${escapeHtml(text)}
            </div>
            <button type="button"
                class="btn-close btn-close-white me-2 m-auto"
                data-bs-dismiss="toast"
                aria-label="Закрыть уведомление">
            </button>
        </div>
    `;

    messageContainer.appendChild(toast);

    setTimeout(() => {
        const toastElement = document.getElementById(toastId);
        if (toastElement) {
            const bsToast = new bootstrap.Toast(toastElement);
            bsToast.hide();
            setTimeout(() => toastElement.remove(), 300);
        }
    }, 5000);

    const bsToast = new bootstrap.Toast(toast);

    toast.querySelector('[data-bs-dismiss="toast"]').addEventListener('click', () => {
        bsToast.hide();
        setTimeout(() => toast.remove(), 300);
    });
}

export {
    updateUserInfo,
    editProfile,
    saveProfile,
    loadMyRentals,
    loadMyProperties,
    approveApplication,
    rejectApplication,
    setupTabSwitching,
    logout,
    editProperty,
    deleteProperty
};