import { initNavbar } from './navbar.js';
import { getAllProperties, getPropertyById, searchProperties, propertyTypeMap, rentalTypeMap, getPlaceholderImage } from './properties.js';
import { getCurrentUserFromStorage, isAuthenticated } from './auth.js';
import { request } from './api.js';

const propertiesList = document.getElementById('propertiesList');
const noResults = document.getElementById('noResults');
const searchForm = document.getElementById('searchForm');
const resetBtn = document.getElementById('resetFilters');
const propertyTypeSelect = document.getElementById('propertyType');
const rentalTypeSelect = document.getElementById('rentalType');

console.log('main.js loaded');

async function init() {
    initNavbar();
    populateReferenceSelects();
    setupEventDelegation();
    setupSearchHandlers();
    await displayProperties();
}

function populateReferenceSelects() {
    if (propertyTypeSelect) {
        Object.entries(propertyTypeMap).forEach(([k, v]) => {
            const opt = document.createElement('option');
            opt.value = k;
            opt.textContent = v;
            propertyTypeSelect.appendChild(opt);
        });
    }

    if (rentalTypeSelect) {
        Object.entries(rentalTypeMap).forEach(([k, v]) => {
            const opt = document.createElement('option');
            opt.value = k;
            opt.textContent = v;
            rentalTypeSelect.appendChild(opt);
        });
    }
}

function createPropertyCard(property) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4 mb-4';

    const imageUrl = (property.images && property.images[0]) ? property.images[0] : getPlaceholderImage(property.propertyType);

    const priceText = property.price ? `${formatPrice(property.price)}` : 'Цена не указана';

    col.innerHTML = `
        <div class="card property-card h-100 shadow-sm">
            <div class="property-image-container">
                <img src="${imageUrl}" class="card-img-top property-image" alt="${escapeHtml(property.title)}"
                     onerror="this.onerror=null; this.src='https://via.placeholder.com/400x250/4A90E2/FFFFFF?text=${encodeURIComponent('Недвижимость')}';">
                <span class="badge property-type-badge">${propertyTypeMap[property.propertyType] || property.propertyType}</span>
            </div>
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${escapeHtml(property.title)}</h5>
                <p class="card-text flex-grow-1" style="min-height:60px;">${escapeHtml(property.description || '')}</p>
                <p class="text-muted mb-1"><i class="bi bi-geo-alt"></i> ${escapeHtml(property.location || '')}</p>
                <p class="text-muted mb-2"><i class="bi bi-calendar"></i> ${rentalTypeMap[property.rentalType] || property.rentalType}</p>
                <div class="d-flex justify-content-between align-items-center mt-auto">
                    <span class="price-tag fw-bold fs-5">${priceText}</span>
                    <button class="btn btn-outline-primary btn-sm view-details" data-property-id="${property.id}">Подробнее</button>
                </div>
            </div>
        </div>
    `;
    return col;
}

async function displayProperties(properties) {
    if (!propertiesList) return;
    propertiesList.innerHTML = '';

    try {
        if (!properties) properties = await getAllProperties();
    } catch (err) {
        console.error('Ошибка получения свойств:', err);
        showNoResults('Ошибка загрузки объектов');
        return;
    }

    if (!properties || properties.length === 0) {
        showNoResults();
        return;
    }

    noResults.classList.add('d-none');
    properties.forEach(p => {
        const card = createPropertyCard(p);
        propertiesList.appendChild(card);
    });
}

function showNoResults(text) {
    const msg = text || 'По вашему запросу ничего не найдено.';
    if (noResults) {
        noResults.querySelector('.alert').textContent = msg;
        noResults.classList.remove('d-none');
    }
}

function setupEventDelegation() {
    document.addEventListener('click', async (e) => {
        const target = e.target;
        if (!target) return;

        if (target.classList.contains('view-details')) {
            const id = target.getAttribute('data-property-id');
            if (id) await showPropertyDetails(parseInt(id, 10));
        }
    });

    const modalChatBtn = document.getElementById('modalChatBtn');
    const modalRentBtn = document.getElementById('modalRentBtn');

    if (modalChatBtn) modalChatBtn.addEventListener('click', () => {
        const id = document.getElementById('modalPropertyTitle')?.dataset?.propertyId;
        if (!id) return;
        startChat(parseInt(id, 10));
    });

    if (modalRentBtn) modalRentBtn.addEventListener('click', () => {
        const id = document.getElementById('modalPropertyTitle')?.dataset?.propertyId;
        if (!id) return;
        handleRental(parseInt(id, 10));
    });
}

function setupSearchHandlers() {
    if (searchForm) {
        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const filters = {
                location: document.getElementById('location').value.trim(),
                propertyType: document.getElementById('propertyType').value || undefined,
                rentalType: document.getElementById('rentalType').value || undefined,
                minPrice: document.getElementById('minPrice').value ? parseFloat(document.getElementById('minPrice').value) : undefined,
                maxPrice: document.getElementById('maxPrice').value ? parseFloat(document.getElementById('maxPrice').value) : undefined
            };
            try {
                const res = await searchProperties(filters);
                await displayProperties(res);
            } catch (err) {
                console.error(err);
                showNoResults('Ошибка поиска');
            }
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', async () => {
            if (searchForm) searchForm.reset();
            await displayProperties();
        });
    }
}

async function showPropertyDetails(propertyId) {
    try {
        const property = await getPropertyById(propertyId);
        if (!property) {
            alert('Объект не найден');
            return;
        }

        const modalTitle = document.getElementById('modalPropertyTitle');
        const modalImage = document.getElementById('modalPropertyImage');
        const modalLocation = document.getElementById('modalPropertyLocation');
        const modalType = document.getElementById('modalPropertyType');
        const modalRentalType = document.getElementById('modalRentalType');
        const modalPrice = document.getElementById('modalPropertyPrice');
        const modalDesc = document.getElementById('modalPropertyDescription');
        const modalArea = document.getElementById('modalPropertyArea');
        const modalRooms = document.getElementById('modalPropertyRooms');
        const modalAmenities = document.getElementById('modalPropertyAmenities');
        const modalAmenitiesList = document.getElementById('modalAmenitiesList');

        if (modalTitle) {
            modalTitle.textContent = property.title;
            modalTitle.dataset.propertyId = property.id;
        }
        if (modalImage) {
            modalImage.src = (property.images && property.images[0]) ? property.images[0] : getPlaceholderImage(property.propertyType);
            modalImage.alt = property.title;
        }
        if (modalLocation) modalLocation.textContent = property.location || '';
        if (modalType) modalType.textContent = propertyTypeMap[property.propertyType] || property.propertyType;
        if (modalRentalType) modalRentalType.textContent = rentalTypeMap[property.rentalType] || property.rentalType;
        if (modalPrice) modalPrice.textContent = property.price ? formatPrice(property.price) : '—';
        if (modalDesc) modalDesc.textContent = property.description || '';

        if (property.area) {
            modalArea.classList.remove('d-none');
            modalArea.querySelector('span').textContent = `${property.area} м²`;
        } else {
            modalArea.classList.add('d-none');
        }

        if (property.rooms) {
            modalRooms.classList.remove('d-none');
            modalRooms.querySelector('span').textContent = property.rooms;
        } else {
            modalRooms.classList.add('d-none');
        }

        if (property.amenities && property.amenities.length) {
            modalAmenities.classList.remove('d-none');
            modalAmenitiesList.innerHTML = property.amenities.map(a => `<span class="badge bg-light text-dark me-1 mb-1">${escapeHtml(a)}</span>`).join('');
        } else {
            modalAmenities.classList.add('d-none');
            modalAmenitiesList.innerHTML = '';
        }

        const modalEl = document.getElementById('propertyModal');
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
    } catch (err) {
        console.error(err);
        alert('Ошибка загрузки данных объекта');
    }
}

function startChat(propertyId) {
    if (!isAuthenticated()) {
        localStorage.setItem('pending_chat', propertyId);
        localStorage.setItem('return_url', window.location.href);
        window.location.href = 'login.html';
        return;
    }
    window.location.href = `chats.html?propertyId=${propertyId}`;
}

function handleRental(propertyId) {
    if (!isAuthenticated()) {
        localStorage.setItem('pending_rental', propertyId);
        localStorage.setItem('return_url', window.location.href);
        window.location.href = 'login.html';
        return;
    }

    const rentalBody = document.getElementById('rentalModalBody');
    const propertyTitle = document.getElementById('modalPropertyTitle').textContent;
    const user = getCurrentUserFromStorage();

    rentalBody.innerHTML = `
        <div class="rental-property-info mb-4">
            <h5>Оформление аренды: ${escapeHtml(propertyTitle)}</h5>
            <div class="property-card bg-light p-3 rounded mb-3">
                <p><strong>Пользователь:</strong> ${escapeHtml(user?.username || '')}</p>
            </div>
        </div>
        <form id="rentalForm">
            <div class="mb-3">
                <label class="form-label">Дата начала</label>
                <input type="date" id="rentalStartDate" class="form-control" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Срок (в днях/месяцах)</label>
                <input type="number" id="rentalDuration" class="form-control" min="1" required>
            </div>
            <div class="d-grid">
                <button class="btn btn-primary" type="submit">Отправить заявку</button>
            </div>
        </form>
    `;

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('rentalStartDate').value = today;

    const rentalModalEl = document.getElementById('rentalModal');
    const rentalModal = new bootstrap.Modal(rentalModalEl);
    rentalModal.show();

    document.getElementById('rentalForm').addEventListener('submit', (e) => {
        e.preventDefault();
        rentalModal.hide();
        alert('Заявка отправлена (мок). Обработка заявки будет реализована позже.');
    });
}

function formatPrice(num) {
    if (num == null || Number.isNaN(Number(num))) return '—';
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(Number(num));
}

function escapeHtml(s = '') {
    return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m]));
}

init();