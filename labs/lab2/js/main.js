import { initNavbar } from './navbar.js';
import { getAllProperties, getPropertyById, searchProperties, propertyTypeMap, rentalTypeMap, getPlaceholderImage } from './properties.js';
import { getCurrentUserFromStorage, isAuthenticated } from './auth.js';

const propertiesList = document.getElementById('propertiesList');
const noResults = document.getElementById('noResults');
const searchForm = document.getElementById('searchForm');
const resetBtn = document.getElementById('resetFilters');
const propertyTypeSelect = document.getElementById('propertyType');
const rentalTypeSelect = document.getElementById('rentalType');

let currentFilters = {};
let isLoading = false;

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
        while (propertyTypeSelect.options.length > 1) {
            propertyTypeSelect.remove(1);
        }

        Object.entries(propertyTypeMap).forEach(([k, v]) => {
            const opt = document.createElement('option');
            opt.value = k;
            opt.textContent = v;
            propertyTypeSelect.appendChild(opt);
        });
    }

    if (rentalTypeSelect) {
        while (rentalTypeSelect.options.length > 1) {
            rentalTypeSelect.remove(1);
        }

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

    const hasRealImage = property.images && property.images.length > 0;
    const imageUrl = hasRealImage
        ? property.images[0]
        : getPlaceholderImage(property.propertyType);

    const propertyTypeText = propertyTypeMap[property.propertyType] || 'Недвижимость';
    const rentalTypeText = rentalTypeMap[property.rentalType] || property.rentalType;

    const priceText = property.price
        ? `${formatPrice(property.price)}`
        : 'Цена не указана';

    const pricePer =
        property.rentalType === 'daily' ? 'день' :
            property.rentalType === 'monthly' ? 'месяц' :
                property.rentalType === 'yearly' ? 'год' : '';

    const imageAlt = hasRealImage
        ? `${propertyTypeText}: ${property.title || 'Объект недвижимости'} — ${property.location || 'Локация не указана'}`
        : 'Изображение объекта недвижимости отсутствует';

    col.innerHTML = `
        <div class="card property-card h-100 shadow-sm hover-shadow"
             style="transition: transform 0.2s, box-shadow 0.2s;">

            <div class="property-image-container position-relative"
                 style="height: 200px; overflow: hidden;">

                <img src="${imageUrl}"
                     class="card-img-top property-image"
                     alt="${escapeHtml(imageAlt)}"
                     style="height: 100%; width: 100%; object-fit: cover;"
                     onerror="this.onerror=null;
                              this.src='${getPlaceholderImage(property.propertyType)}';
                              this.alt='Изображение объекта недвижимости отсутствует';">

                <span class="badge bg-primary position-absolute top-0 start-0 m-2">
                    ${propertyTypeText}
                </span>

                <span class="badge bg-success position-absolute top-0 end-0 m-2">
                    ${rentalTypeText}
                </span>
            </div>

            <div class="card-body d-flex flex-column">
                <h5 class="card-title">
                    ${escapeHtml(property.title || 'Без названия')}
                </h5>

                <p class="card-text text-muted small flex-grow-1"
                   style="min-height: 60px;">
                    ${escapeHtml(property.description || 'Описание отсутствует')}
                </p>

                <div class="mt-3">
                    <p class="mb-1">
                        <svg class="icon me-2" aria-hidden="true">
                            <use href="../assets/icons.svg#icon-geo"></use>
                        </svg>
                        ${escapeHtml(property.location || 'Не указано')}
                    </p>

                    <div class="d-flex justify-content-between align-items-center
                                mt-auto pt-2 border-top">

                        <div>
                            <span class="price-tag fw-bold fs-5 text-primary">
                                ${priceText}
                            </span>
                            ${pricePer
        ? `<span class="text-muted small ms-1">/ ${pricePer}</span>`
        : ''}
                        </div>

                        <button class="btn btn-outline-primary btn-sm view-details"
                                data-property-id="${property.id}"
                                aria-label="Подробнее об объекте ${escapeHtml(property.title || '')}">
                            <svg class="icon me-2" aria-hidden="true">
                                <use href="../assets/icons.svg#icon-eye"></use>
                            </svg>
                            Подробнее
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    return col;
}

async function displayProperties(properties) {
    if (!propertiesList) return;

    if (isLoading) return;
    isLoading = true;

    try {
        propertiesList.innerHTML = '<div class="col-12 text-center py-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Загрузка...</span></div><p class="mt-3">Загрузка объектов...</p></div>';

        if (!properties) {
            properties = await getAllProperties();
        }

        propertiesList.innerHTML = '';

        if (!properties || properties.length === 0) {
            showNoResults();
            return;
        }

        noResults.classList.add('d-none');
        properties.forEach(p => {
            const card = createPropertyCard(p);
            propertiesList.appendChild(card);
        });

    } catch (err) {
        console.error('Ошибка получения свойств:', err);
        showNoResults('Ошибка загрузки объектов. Пожалуйста, попробуйте позже.');
    } finally {
        isLoading = false;
    }
}

function showNoResults(text) {
    const msg = text || 'По вашему запросу ничего не найдено. Попробуйте изменить параметры поиска.';
    if (noResults) {
        noResults.querySelector('.alert').textContent = msg;
        noResults.classList.remove('d-none');
    }
}

function setupEventDelegation() {
    document.addEventListener('click', async (e) => {
        const target = e.target;
        if (!target) return;

        const button = target.closest('.view-details');
        if (button) {
            const id = button.getAttribute('data-property-id');
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
            await performSearch();
        });

        ['location', 'propertyType', 'rentalType', 'minPrice', 'maxPrice'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', async () => {
                });
            }
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', async () => {
            if (searchForm) {
                searchForm.reset();
                currentFilters = {};
                await displayProperties();

                const toast = document.createElement('div');
                toast.className = 'position-fixed bottom-0 end-0 p-3';
                toast.innerHTML = `
                    <div class="toast show" role="alert">
                        <div class="toast-header">
                            <strong class="me-auto">RentEstate</strong>
                            <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
                        </div>
                        <div class="toast-body">
                            Фильтры сброшены. Показаны все объекты.
                        </div>
                    </div>
                `;
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 3000);
            }
        });
    }
}

async function performSearch() {
    const filters = {
        location: document.getElementById('location').value.trim(),
        propertyType: document.getElementById('propertyType').value || undefined,
        rentalType: document.getElementById('rentalType').value || undefined,
        minPrice: document.getElementById('minPrice').value ?
            (document.getElementById('minPrice').value === '' ? undefined : parseFloat(document.getElementById('minPrice').value)) :
            undefined,
        maxPrice: document.getElementById('maxPrice').value ?
            (document.getElementById('maxPrice').value === '' ? undefined : parseFloat(document.getElementById('maxPrice').value)) :
            undefined
    };

    if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
        if (filters.minPrice > filters.maxPrice) {
            alert('Минимальная цена не может быть больше максимальной');
            return;
        }
    }

    if (filters.minPrice !== undefined && filters.minPrice < 0) {
        alert('Цена не может быть отрицательной');
        return;
    }

    if (filters.maxPrice !== undefined && filters.maxPrice < 0) {
        alert('Цена не может быть отрицательной');
        return;
    }

    currentFilters = filters;

    try {
        const res = await searchProperties(filters);
        await displayProperties(res);

        if (res && res.length > 0) {
            showSearchResultsMessage(res.length);
        }
    } catch (err) {
        console.error('Ошибка поиска:', err);
        showNoResults('Ошибка поиска. Пожалуйста, проверьте параметры и попробуйте снова.');
    }
}

function showSearchResultsMessage(count) {
    const message = document.createElement('div');
    message.className = 'alert alert-info alert-dismissible fade show mt-3';
    message.innerHTML = `
        Найдено объектов: <strong>${count}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    const existingAlert = document.querySelector('.search-results-alert');
    if (existingAlert) existingAlert.remove();

    message.classList.add('search-results-alert');

    const searchFormCard = document.querySelector('.card.mb-4');
    if (searchFormCard) {
        searchFormCard.parentNode.insertBefore(message, searchFormCard.nextSibling);
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

        const propertyImage = (property.images && property.images[0])
            ? property.images[0]
            : getPlaceholderImage(property.propertyType);

        if (modalImage) {
            modalImage.src = propertyImage;

            modalImage.alt = `${propertyTypeMap[property.propertyType] || 'Недвижимость'}: ` +
                `${property.title || 'Объект недвижимости'} — ` +
                `${property.location || 'Локация не указана'}`;

            modalImage.onerror = () => {
                modalImage.src = getPlaceholderImage(property.propertyType);
                modalImage.alt = 'Изображение объекта недвижимости отсутствует';
            };
        }

        if (modalLocation) modalLocation.textContent = property.location || 'Не указано';
        if (modalType) modalType.textContent = propertyTypeMap[property.propertyType] || property.propertyType;
        if (modalRentalType) modalRentalType.textContent = rentalTypeMap[property.rentalType] || property.rentalType;
        if (modalPrice) {
            const pricePer = property.rentalType === 'daily' ? 'день' :
                property.rentalType === 'monthly' ? 'месяц' :
                    property.rentalType === 'yearly' ? 'год' : '';
            modalPrice.textContent = property.price ?
                `${formatPrice(property.price)}${pricePer ? ' / ' + pricePer : ''}` :
                'Цена не указана';
        }

        if (modalDesc) {
            modalDesc.textContent = property.description || 'Описание отсутствует';
            modalDesc.style.minHeight = '100px';
        }

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
            modalAmenitiesList.innerHTML = property.amenities.map(a =>
                `<span class="badge bg-light text-dark me-1 mb-1 border">${escapeHtml(a)}</span>`
            ).join('');
        } else {
            modalAmenities.classList.add('d-none');
            modalAmenitiesList.innerHTML = '';
        }

        const modalChatBtn = document.getElementById('modalChatBtn');
        const modalRentBtn = document.getElementById('modalRentBtn');

        if (isAuthenticated()) {
            if (modalChatBtn) {
                modalChatBtn.disabled = false;
                modalChatBtn.innerHTML = '<svg class="icon me-2" aria-hidden="true">\n' +
                    '                  <use href="../assets/icons.svg#icon-chat"></use>\n' +
                    '                </svg> Начать чат с владельцем';
            }
            if (modalRentBtn) {
                modalRentBtn.disabled = false;
                modalRentBtn.textContent = 'Арендовать';
            }
        } else {
            if (modalChatBtn) {
                modalChatBtn.disabled = false;
                modalChatBtn.innerHTML = '<svg class="icon me-2" aria-hidden="true">\n' +
                    '                  <use href="../assets/icons.svg#icon-chat"></use>\n' +
                    '                </svg> Войти для чата';
            }
            if (modalRentBtn) {
                modalRentBtn.disabled = false;
                modalRentBtn.textContent = 'Войти для аренды';
            }
        }

        const modalEl = document.getElementById('propertyModal');
        const modal = new bootstrap.Modal(modalEl);

        let lastFocusedElement = document.activeElement;

        modalEl.addEventListener('hidden.bs.modal', () => {
            if (lastFocusedElement) {
                lastFocusedElement.focus();
            }
        }, { once: true });

        modal.show();

    } catch (err) {
        console.error('Ошибка загрузки данных объекта:', err);
        alert('Ошибка загрузки данных объекта');
    }
}

function startChat(propertyId) {
    if (!isAuthenticated()) {
        localStorage.setItem('pending_chat', propertyId);
        localStorage.setItem('return_url', window.location.href);
        window.location.href = 'pages/login.html';
        return;
    }
    window.location.href = `pages/chats.html?propertyId=${propertyId}`;
}

function handleRental(propertyId) {
    if (!isAuthenticated()) {
        localStorage.setItem('pending_rental', propertyId);
        localStorage.setItem('return_url', window.location.href);
        window.location.href = 'pages/login.html';
        return;
    }

    const rentalBody = document.getElementById('rentalModalBody');
    const propertyTitle = document.getElementById('modalPropertyTitle').textContent;
    const user = getCurrentUserFromStorage();

    rentalBody.innerHTML = `
        <div class="rental-property-info mb-4">
            <h5>Оформление аренды</h5>
            <div class="rental-property-card mb-3">
                <h6>${escapeHtml(propertyTitle)}</h6>
                <p class="mb-0"><strong>Арендатор:</strong> ${escapeHtml(user?.username || '')} (${escapeHtml(user?.email || '')})</p>
            </div>
        </div>
        <form id="rentalForm">
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Дата начала аренды *</label>
                    <input type="date" id="rentalStartDate" class="form-control" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Срок аренды *</label>
                        <div class="input-group">
                            <input type="number" id="rentalDuration" class="form-control" min="1" value="1" required>
                            <span class="input-group-text" id="durationUnit">дней</span>
                        </div>
                        <div class="form-text">Минимальный срок: 1 день</div>
                </div>
            </div>
            <div class="mb-3">
                <label class="form-label">Комментарий (необязательно)</label>
                <textarea id="rentalComment" class="form-control" rows="3" placeholder="Дополнительная информация..."></textarea>
            </div>
            <div class="alert alert-info">
                <svg class="icon me-2" aria-hidden="true">
                    <use href="../assets/icons.svg#icon-info-circle"></use>
                </svg>
                После отправки заявки владелец недвижимости свяжется с вами для подтверждения.
            </div>
            <div class="d-grid gap-2">
                <button class="btn btn-primary" type="submit">
                    <svg class="icon me-2" aria-hidden="true">
                        <use href="../assets/icons.svg#icon-send"></use>
                    </svg>
                 Отправить заявку на аренду
                </button>
                <button class="btn btn-outline-secondary" type="button" data-bs-dismiss="modal">Отмена</button>
            </div>
        </form>
    `;

    const today = new Date().toISOString().split('T')[0];
    const startDateInput = document.getElementById('rentalStartDate');
    startDateInput.min = today;
    startDateInput.value = today;

    const rentalModalEl = document.getElementById('rentalModal');
    const rentalModal = new bootstrap.Modal(rentalModalEl);

    let lastFocusedElement = document.activeElement;

    rentalModalEl.addEventListener('hidden.bs.modal', () => {
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    }, { once: true });

    rentalModal.show();

    document.getElementById('rentalForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            rentalModal.hide();

            const successToast = document.createElement('div');
            successToast.className = 'position-fixed bottom-0 end-0 p-3';
            successToast.innerHTML = `
                <div class="toast show bg-success text-white" role="alert">
                    <div class="toast-body">
                        <svg class="icon me-2" aria-hidden="true">
                            <use href="../assets/icons.svg#icon-check-circle"></use>
                        </svg>
                        Заявка на аренду отправлена! Владелец свяжется с вами в ближайшее время.
                    </div>
                </div>
            `;
            document.body.appendChild(successToast);
            setTimeout(() => successToast.remove(), 5000);

        } catch (error) {
            console.error('Ошибка отправки заявки:', error);
            alert('Ошибка отправки заявки. Пожалуйста, попробуйте снова.');
        }
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