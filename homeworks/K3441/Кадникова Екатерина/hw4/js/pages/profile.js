import { authSession } from '../auth/auth.session.js';
import { logout } from '../auth/auth.service.js';
import { getMe, updateUser } from '../api/users.api.js';
import {
    getUserProperties,
    propertyTypeMap,
    rentalTypeMap,
    deleteProperty as deletePropertyApi,
    getPlaceholderImage as getPropertyPlaceholderImage,
    updateProperty
} from '../api/properties.api.js';
import { getMyRentals, updateRentalStatus} from '../api/rentals.api.js';

let editingProperty = null;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const sessionUser = authSession.getUser();
        if (!sessionUser) throw new Error('User not authenticated');

        let user = sessionUser;

        try {
            const me = await getMe();
            if (me) {
                user = me;
                authSession.setSession({ user });
            }
        } catch (err) {
            console.warn('Не удалось получить актуальные данные пользователя:', err);
        }

        updateUserInfo(user);
        updateUserStats();
        setupTabSwitching(user.id);

        await loadProfileStats(user.id);

        await loadTabData('my-rentals-tab', user.id);
    } catch (err) {
        console.error(err);
        window.location.href = 'login.html';
    }
});


function updateUserInfo(user) {
    setText('userAvatar', user.username?.charAt(0).toUpperCase() || '?');
    setText('userUsername', user.username);
    setText('userUsername2', user.username);
    setText('userEmail', user.email);
    setText('userEmail2', user.email);
    setText('userPhone', user.phone || 'Не указан');
    setText('userRole', user.role === 'ADMIN' ? 'Администратор' : 'Пользователь');
}

function updateUserStats() {
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
    const user = authSession.getUser();
    if (!user) return;

    setValue('editUsername', user.username);
    setValue('editEmail', user.email);
    setValue('editPhone', user.phone || '');
    setValue('editPassword', '');

    new bootstrap.Modal('#editProfileModal').show();
}

async function saveProfile() {
    const user = authSession.getUser();
    if (!user) return;

    const data = {};
    const username = getValue('editUsername');
    const email = getValue('editEmail');
    const phone = getValue('editPhone');
    const password = getValue('editPassword');

    if (username !== user.username) data.username = username;
    if (email !== user.email) data.email = email;
    if (phone !== (user.phone || '')) data.phone = phone;
    if (password) data.password = password;

    if (!Object.keys(data).length) {
        showInfo('Нет изменений');
        return;
    }

    try {
        const updated = await updateUser(user.id, data);
        authSession.setSession({ user: updated });
        updateUserInfo(updated);

        bootstrap.Modal.getInstance(document.getElementById('editProfileModal'))?.hide();
        showSuccess('Профиль обновлён');
    } catch (err) {
        showError(err.message || 'Ошибка обновления профиля');
    }
}


function setupTabSwitching(userId) {
    const tabs = document.getElementById('rentalTabs');
    if (!tabs) return;

    tabs.addEventListener('shown.bs.tab', async (e) => {
        await loadTabData(e.target.id, userId);
    });
}

async function loadTabData(tabId, userId) {
    const loadingHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-primary"></div>
            <p class="mt-3">Загрузка...</p>
        </div>
    `;

    if (tabId === 'my-rentals-tab') {
        const c = document.getElementById('myRentalsContent');
        if (c) c.innerHTML = loadingHTML;
        await loadMyRentals(userId);
    }

    if (tabId === 'my-properties-tab') {
        const c = document.getElementById('myPropertiesContent');
        if (c) c.innerHTML = loadingHTML;
        await loadMyProperties(userId);
    }
}


async function loadMyRentals(userId) {
    const content = document.getElementById('myRentalsContent');
    if (!content) return;

    try {
        const rentals = await getMyRentals();

        setText('rentalsCount', rentals.length);

        if (!rentals.length) {
            content.innerHTML = `
                <div class="text-center py-4">
                    <h5>У вас пока нет заявок на аренду</h5>
                    <p class="text-muted">Найдите недвижимость и отправьте заявку</p>
                    <a href="../index.html" class="btn btn-primary">
                        Найти недвижимость
                    </a>
                </div>
            `;
            return;
        }

        content.innerHTML = `
            <div class="list-group">
                ${rentals.map(renderRentalCard).join('')}
            </div>
        `;
    } catch (err) {
        content.innerHTML = `
            <div class="alert alert-danger">
                Ошибка загрузки заявок: ${err.message}
            </div>
        `;
    }
}

async function loadMyPropertiesRentals(userId) {
    const container = document.getElementById('myPropertiesRentalsContent');
    if (!container) return;

    try {
        const rentals = await getMyRentals();
        const myPropertiesIds = (await getUserProperties(userId)).map(p => p.id);
        const myRentals = rentals.filter(r => myPropertiesIds.includes(r.propertyId));

        if (!myRentals.length) {
            container.innerHTML = `<p class="text-muted">Пока нет заявок на ваши объекты</p>`;
            return;
        }

        container.innerHTML = `
            <div class="list-group">
                ${myRentals.map(r => renderMyPropertyRentalCard(r)).join('')}
            </div>
        `;
    } catch (err) {
        container.innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
    }
}

function renderRentalCard(rental) {
    const statusMap = {
        active: 'Активна',
        completed: 'Завершена',
        cancelled: 'Отменена',
        pending: 'Ожидает подтверждения'
    };

    const statusClassMap = {
        active: 'badge-active',
        completed: 'badge-completed',
        cancelled: 'badge-cancelled',
        pending: 'badge-pending'
    };

    return `
        <div class="rental-card">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <h5>${escapeHtml(rental.property?.title || 'Объект недвижимости')}</h5>
                    <p class="text-muted mb-1">${escapeHtml(rental.property?.location || '')}</p>
                </div>

                <span class="badge badge-status ${statusClassMap[rental.status] || 'badge-secondary'}">
                    ${statusMap[rental.status] || rental.status}
                </span>
            </div>

            <hr class="my-2">

            <div class="row small text-muted">
                <div class="col-md-4"><strong>С:</strong> ${formatDate(rental.startedAt)}</div>
                <div class="col-md-4"><strong>По:</strong> ${formatDate(rental.endedAt)}</div>
                <div class="col-md-4"><strong>Создано:</strong> ${formatDate(rental.createdAt)}</div>
            </div>
        </div>
    `;
}


async function loadMyProperties(userId) {
    const content = document.getElementById('myPropertiesContent');
    if (!content) return;

    try {
        const properties = await getUserProperties(userId);

        if (!properties.length) {
            content.innerHTML = `
                <div class="text-center py-4">
                    <h5>У вас нет объектов недвижимости</h5>
                    <a href="add-property.html" class="btn btn-success mt-3">
                        Добавить объект
                    </a>
                </div>
            `;
            return;
        }

        content.innerHTML = `
            <div class="row">
                ${properties.map(p => {
            const img = p.images?.[0] || getPropertyPlaceholderImage(p.propertyType);
            return `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card h-100 shadow-sm">
                        <img src="${img}" class="card-img-top" style="height:200px;object-fit:cover">
                        <div class="card-body d-flex flex-column">
                            <h5>${escapeHtml(p.title)}</h5>
                            <p class="text-muted small flex-grow-1">${escapeHtml(p.description || 'Без описания')}</p>
                            <strong>${formatPrice(p.price)}</strong>
                            <div class="btn-group mt-3">
                                <button class="btn btn-outline-warning" onclick="editProperty(${p.id})" aria-label="Редактировать">
                                    <svg class="icon" aria-hidden="true"><use href="../assets/icons.svg#icon-pencil-square"></use></svg>
                                </button>
                                <button class="btn btn-outline-danger" onclick="deleteProperty(${p.id})" aria-label="Удалить">
                                    <svg class="icon" aria-hidden="true"><use href="../assets/icons.svg#icon-trash"></use></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('')}
            </div>
            <hr>
            <h5 class="mt-4">Заявки на аренду ваших объектов</h5>
            <div id="myPropertiesRentalsContent"></div>
        `;

        await loadMyPropertiesRentals(userId);
    } catch (err) {
        content.innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
    }
}

function renderMyPropertyRentalCard(rental) {
    const statusMap = {
        active: 'Активна',
        completed: 'Завершена',
        cancelled: 'Отменена',
        pending: 'Ожидает подтверждения'
    };

    const statusClassMap = {
        active: 'badge-active',
        completed: 'badge-completed',
        cancelled: 'badge-cancelled',
        pending: 'badge-pending'
    };

    const isPending = rental.status === 'pending';

    return `
        <div class="rental-card">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <h6>${escapeHtml(rental.property?.title || 'Объект')}</h6>
                    <p class="text-muted mb-1">${escapeHtml(rental.user?.username || 'Пользователь')}</p>
                </div>
                <span class="badge badge-status ${statusClassMap[rental.status] || 'badge-secondary'}">
                    ${statusMap[rental.status] || rental.status}
                </span>
            </div>

            <hr class="my-2">

            <div class="row small text-muted mb-2">
                <div class="col-md-4"><strong>С:</strong> ${formatDate(rental.startedAt)}</div>
                <div class="col-md-4"><strong>По:</strong> ${formatDate(rental.endedAt)}</div>
                <div class="col-md-4"><strong>Создано:</strong> ${formatDate(rental.createdAt)}</div>
            </div>

            ${isPending ? `
                <div class="d-flex gap-2">
                    <button
                        class="btn btn-success btn-sm js-rental-action"
                        data-rental-id="${rental.id}"
                        data-status="active">
                        Подтвердить
                    </button>

                    <button
                        class="btn btn-danger btn-sm js-rental-action"
                        data-rental-id="${rental.id}"
                        data-status="cancelled">
                        Отклонить
                    </button>
                </div>
            ` : ''}
        </div>
    `;
}


async function loadProfileStats(userId) {
    try {
        const [rentals, properties] = await Promise.all([
            getMyRentals(),
            getUserProperties(userId)
        ]);

        setText('rentalsCount', rentals.length);
        setText('propertiesCount', properties.length);
    } catch (err) {
        console.warn('Не удалось загрузить статистику профиля', err);
    }
}

async function deleteProperty(id) {
    if (!confirm('Удалить объект?')) return;
    await deletePropertyApi(id);
    const userId = authSession.getUser().id;
    await loadMyProperties(userId);
    await loadProfileStats(userId);
    showSuccess('Объект удалён');
}

async function editProperty(id) {
    const userId = authSession.getUser().id;
    const properties = await getUserProperties(userId);

    const property = properties.find(p => p.id === id);
    if (!property) {
        showError('Объект не найден');
        return;
    }

    editingProperty = property;

    setValue('editPropertyTitleInput', property.title);
    setValue('editPropertyDescription', property.description || '');
    setValue('editPropertyPrice', property.price);
    setValue('editPropertyLocation', property.location);

    fillSelect(
        'editPropertyType',
        propertyTypeMap,
        property.propertyType
    );

    fillSelect(
        'editRentalType',
        rentalTypeMap,
        property.rentalType
    );

    new bootstrap.Modal('#editPropertyModal').show();
}

async function saveProperty() {
    if (!editingProperty) return;

    const data = {};

    const title = getValue('editPropertyTitleInput');
    const description = getValue('editPropertyDescription');
    const price = Number(getValue('editPropertyPrice'));
    const location = getValue('editPropertyLocation');
    const propertyType = getValue('editPropertyType');
    const rentalType = getValue('editRentalType');

    if (title !== editingProperty.title) data.title = title;
    if (description !== (editingProperty.description || '')) data.description = description;
    if (price !== editingProperty.price) data.price = price;
    if (location !== editingProperty.location) data.location = location;
    if (propertyType !== editingProperty.propertyType) data.propertyType = propertyType;
    if (rentalType !== editingProperty.rentalType) data.rentalType = rentalType;

    if (!Object.keys(data).length) {
        showInfo('Нет изменений');
        return;
    }

    try {
        await updateProperty(editingProperty.id, data);

        bootstrap.Modal.getInstance(
            document.getElementById('editPropertyModal')
        )?.hide();

        editingProperty = null;

        const userId = authSession.getUser().id;
        await loadMyProperties(userId);

        showSuccess('Объект обновлён');
    } catch (err) {
        showError(err.message || 'Ошибка обновления объекта');
    }
}

document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.js-rental-action');
    if (!btn) return;

    const rentalId = btn.dataset.rentalId;
    const status = btn.dataset.status;

    if (!rentalId || !status) return;

    try {
        btn.disabled = true;

        await updateRentalStatus(rentalId, status);
        showSuccess('Статус заявки обновлён');

        await loadMyProperties(authSession.getUser().id);
    } catch (err) {
        showError(err.message || 'Ошибка обновления статуса');
    } finally {
        btn.disabled = false;
    }
});


function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function setValue(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value;
}

function getValue(id) {
    return document.getElementById(id)?.value.trim();
}

function formatPrice(n) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0
    }).format(n);
}

function escapeHtml(text = '') {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(date) {
    if (!date) return '—';
    return new Intl.DateTimeFormat('ru-RU').format(new Date(date));
}

function fillSelect(id, map, selected) {
    const select = document.getElementById(id);
    if (!select) return;

    select.innerHTML = Object.entries(map)
        .map(([value, label]) =>
            `<option value="${value}" ${value === selected ? 'selected' : ''}>
                ${label}
            </option>`
        )
        .join('');
}


function showSuccess(msg) { alert(msg); }
function showError(msg) { alert(msg); }
function showInfo(msg) { alert(msg); }


window.editProfile = editProfile;
window.saveProfile = saveProfile;
window.deleteProperty = deleteProperty;
window.editProperty = editProperty;
window.saveProperty = saveProperty;
window.logout = logout;