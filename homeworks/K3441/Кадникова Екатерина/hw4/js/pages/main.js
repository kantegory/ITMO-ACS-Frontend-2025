import { initNavbar } from '../core/navbar.js';
import { getAllProperties, getPropertyById, searchProperties, propertyTypeMap, rentalTypeMap, getPlaceholderImage } from '../api/properties.api.js';
import { createRental } from '../api/rentals.api.js';
import { authSession } from '../auth/auth.session.js';

const propertiesList = document.getElementById('propertiesList');
const noResults = document.getElementById('noResults');
const searchForm = document.getElementById('searchForm');
const resetBtn = document.getElementById('resetFilters');
const propertyTypeSelect = document.getElementById('propertyType');
const rentalTypeSelect = document.getElementById('rentalType');

let currentFilters = {};
let isLoading = false;

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

        if (modalTitle) {
            modalTitle.textContent = property.title;
            modalTitle.dataset.propertyId = property.id;
        }

        const propertyImage = (property.images && property.images[0]) ? property.images[0] : getPlaceholderImage(property.propertyType);

        if (modalImage) {
            modalImage.src = propertyImage;
            modalImage.alt = `${propertyTypeMap[property.propertyType] || 'Недвижимость'}: ${property.title || 'Объект'} — ${property.location || 'Локация не указана'}`;
            modalImage.onerror = () => {
                modalImage.src = getPlaceholderImage(property.propertyType);
                modalImage.alt = 'Изображение объекта отсутствует';
            };
        }

        if (modalLocation) modalLocation.textContent = property.location || 'Не указано';
        if (modalType) modalType.textContent = propertyTypeMap[property.propertyType] || property.propertyType;
        if (modalRentalType) modalRentalType.textContent = rentalTypeMap[property.rentalType] || property.rentalType;
        if (modalPrice) {
            const pricePer = property.rentalType === 'daily' ? 'день' : property.rentalType === 'monthly' ? 'месяц' : property.rentalType === 'yearly' ? 'год' : '';
            modalPrice.textContent = property.price ? `${formatPrice(property.price)}${pricePer ? ' / ' + pricePer : ''}` : 'Цена не указана';
        }

        if (modalDesc) modalDesc.textContent = property.description || 'Описание отсутствует';

        const modalEl = document.getElementById('propertyModal');
        const modal = new bootstrap.Modal(modalEl);

        let lastFocusedElement = document.activeElement;
        modalEl.addEventListener('hidden.bs.modal', () => { if (lastFocusedElement) lastFocusedElement.focus(); }, { once: true });

        modal.show();

        const rentBtn = document.getElementById('modalRentBtn');
        if (rentBtn) {
            rentBtn.onclick = () => openRentalModal(property.id);
        }

    } catch (err) {
        console.error('Ошибка загрузки данных объекта:', err);
        alert('Ошибка загрузки данных объекта');
    }
}

function openRentalModal(propertyId) {
    if (!authSession.isAuthenticated()) {
        alert('Для оформления аренды необходимо войти в систему');
        return;
    }

    document.getElementById('rentalPropertyId').value = propertyId;
    document.getElementById('rentalForm').reset();

    const rentalModalEl = document.getElementById('rentalModal');
    const rentalModal = new bootstrap.Modal(rentalModalEl);

    rentalModal.show();
}

function setupRentalForm() {
    const form = document.getElementById('rentalForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const propertyId = Number(document.getElementById('rentalPropertyId').value);
        const startedAt = document.getElementById('rentalStart').value;
        const endedAt = document.getElementById('rentalEnd').value;

        try {
            await createRental({
                propertyId,
                startedAt,
                endedAt
            });

            alert('Аренда успешно оформлена');

            bootstrap.Modal.getInstance(
                document.getElementById('rentalModal')
            )?.hide();

            bootstrap.Modal.getInstance(
                document.getElementById('propertyModal')
            )?.hide();

        } catch (err) {
            alert(err.message);
        }
    });
}

function populateReferenceSelects() {
    const fillSelect = (select, map) => {
        if (!select) return;
        while (select.options.length > 1) select.remove(1);
        Object.entries(map).forEach(([k, v]) => {
            const opt = document.createElement('option');
            opt.value = k;
            opt.textContent = v;
            select.appendChild(opt);
        });
    };
    fillSelect(propertyTypeSelect, propertyTypeMap);
    fillSelect(rentalTypeSelect, rentalTypeMap);
}

function createPropertyCard(property) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4 mb-4';

    const imageUrl = (property.images && property.images[0]) || getPlaceholderImage(property.propertyType);
    const propertyTypeText = propertyTypeMap[property.propertyType] || 'Недвижимость';
    const rentalTypeText = rentalTypeMap[property.rentalType] || property.rentalType;
    const priceText = property.price ? formatPrice(property.price) : 'Цена не указана';
    const pricePer = property.rentalType === 'daily' ? 'день' : property.rentalType === 'monthly' ? 'месяц' : property.rentalType === 'yearly' ? 'год' : '';

    col.innerHTML = `
        <div class="card property-card h-100 shadow-sm hover-shadow">
            <div class="property-image-container position-relative" style="height:200px; overflow:hidden;">
                <img src="${imageUrl}" class="card-img-top property-image" alt="${escapeHtml(property.title || 'Объект недвижимости')}" style="height:100%; width:100%; object-fit:cover;">
                <span class="badge bg-primary position-absolute top-0 start-0 m-2">${propertyTypeText}</span>
                <span class="badge bg-success position-absolute top-0 end-0 m-2">${rentalTypeText}</span>
            </div>
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${escapeHtml(property.title || 'Без названия')}</h5>
                <p class="card-text text-muted small flex-grow-1" style="min-height:60px;">${escapeHtml(property.description || 'Описание отсутствует')}</p>
                <div class="mt-3">
                    <p class="mb-1"><svg class="icon me-2"><use href="../assets/icons.svg#icon-geo"></use></svg>${escapeHtml(property.location || 'Не указано')}</p>
                    <div class="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
                        <div><span class="price-tag fw-bold fs-5 text-primary">${priceText}</span>${pricePer ? `<span class="text-muted small ms-1">/ ${pricePer}</span>` : ''}</div>
                        <button class="btn btn-outline-primary btn-sm view-details" data-property-id="${property.id}">Подробнее</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    return col;
}

async function displayProperties(properties) {
    if (!propertiesList || isLoading) return;
    isLoading = true;

    try {
        propertiesList.innerHTML = '<div class="col-12 text-center py-5"><div class="spinner-border text-primary"></div><p class="mt-3">Загрузка объектов...</p></div>';

        if (!properties) properties = await getAllProperties();

        propertiesList.innerHTML = '';
        if (!properties.length) {
            showNoResults();
            return;
        }

        noResults?.classList.add('d-none');
        properties.forEach(p => propertiesList.appendChild(createPropertyCard(p)));

    } catch (err) {
        console.error(err);
        showNoResults('Ошибка загрузки объектов. Попробуйте позже.');
    } finally {
        isLoading = false;
    }
}

function showNoResults(msg = 'По вашему запросу ничего не найдено.') {
    if (!noResults) return;
    noResults.querySelector('.alert').textContent = msg;
    noResults.classList.remove('d-none');
}

function setupEventDelegation() {
    document.addEventListener('click', async e => {
        const button = e.target.closest('.view-details');
        if (button) {
            const id = button.dataset.propertyId;
            if (id) await showPropertyDetails(parseInt(id, 10));
        }
    });
}

function setupSearchHandlers() {
    if (!searchForm) return;
    searchForm.addEventListener('submit', async e => {
        e.preventDefault();
        await performSearch();
    });

    resetBtn?.addEventListener('click', async () => {
        searchForm.reset();
        currentFilters = {};
        await displayProperties();
    });
}

async function performSearch() {
    const filters = {
        location: document.getElementById('location')?.value.trim(),
        propertyType: document.getElementById('propertyType')?.value || undefined,
        rentalType: document.getElementById('rentalType')?.value || undefined,
        minPrice: parseFloat(document.getElementById('minPrice')?.value) || undefined,
        maxPrice: parseFloat(document.getElementById('maxPrice')?.value) || undefined
    };
    currentFilters = filters;

    try {
        const res = await searchProperties(filters);
        await displayProperties(res);
    } catch (err) {
        console.error(err);
        showNoResults('Ошибка поиска объектов');
    }
}

function formatPrice(num) {
    if (!num) return '—';
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(num);
}

function escapeHtml(s = '') {
    return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m]));
}

async function init() {
    initNavbar();
    populateReferenceSelects();
    setupEventDelegation();
    setupSearchHandlers();
    setupRentalForm();
    await displayProperties();
}

init();