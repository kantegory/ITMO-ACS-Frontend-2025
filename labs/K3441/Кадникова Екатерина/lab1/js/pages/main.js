// элементы DOM
const propertiesList = document.getElementById('propertiesList');
const noResults = document.getElementById('noResults');
const searchForm = document.getElementById('searchForm');
const resetFiltersBtn = document.getElementById('resetFilters');

// отобразить недвижимость
function displayProperties(properties = getAllProperties()) {
    if (!propertiesList) return;

    propertiesList.innerHTML = '';

    if (properties.length === 0) {
        noResults.classList.remove('d-none');
        return;
    }

    noResults.classList.add('d-none');

    properties.forEach(property => {
        const propertyCard = createPropertyCard(property);
        propertiesList.appendChild(propertyCard);
    });
}

// создать карточку недвижимости
function createPropertyCard(property) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4 mb-4';

    const formattedPrice = RentEstateApp.formatPrice(property.price);
    const imageUrl = property.images && property.images[0] ? property.images[0] : getPlaceholderImage(property.propertyType);
    const propertyTypeText = window.propertyTypeMap[property.propertyType] || 'Недвижимость';

    col.innerHTML = `
        <div class="card property-card h-100">
            <div class="property-image-container">
                <img src="${imageUrl}" 
                     class="card-img-top property-image" 
                     alt="${property.title}"
                     onerror="this.src='${getPlaceholderImage(property.propertyType)}'">
                <span class="badge property-type-badge">
                    ${propertyTypeText}
                </span>
            </div>
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${property.title}</h5>
                <p class="card-text flex-grow-1" style="min-height: 60px;">${property.description}</p>
                <div class="mt-auto">
                    <p class="card-text mb-1">
                        <small class="text-muted">
                            <i class="bi bi-geo-alt"></i> ${property.location}
                        </small>
                    </p>
                    <p class="card-text mb-2">
                        <small class="text-muted">
                            <i class="bi bi-calendar"></i> ${window.rentalTypeMap[property.rentalType]}
                        </small>
                    </p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="price-tag fw-bold fs-5">${formattedPrice}</span>
                        <button class="btn btn-outline-primary btn-sm view-details" 
                                data-property-id="${property.id}">
                            Подробнее
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    return col;
}

// показать детали объекта в модальном окне
function showPropertyDetails(propertyId) {
    console.log('Показ деталей объекта:', propertyId);

    const property = getPropertyById(propertyId);
    if (!property) {
        console.error('Объект не найден:', propertyId);
        return;
    }

    const modalTitle = document.getElementById('modalPropertyTitle');
    if (modalTitle) {
        modalTitle.textContent = property.title;
        modalTitle.setAttribute('data-property-id', propertyId);
    }

    const imageUrl = property.images && property.images[0] ? property.images[0] : getPlaceholderImage(property.propertyType);
    const modalImage = document.getElementById('modalPropertyImage');
    if (modalImage) {
        modalImage.src = imageUrl;
        modalImage.alt = property.title;
    }

    document.getElementById('modalPropertyLocation').textContent = property.location;
    document.getElementById('modalPropertyType').textContent = window.propertyTypeMap[property.propertyType];
    document.getElementById('modalRentalType').textContent = window.rentalTypeMap[property.rentalType];
    document.getElementById('modalPropertyDescription').textContent = property.description;
    document.getElementById('modalPropertyPrice').textContent = RentEstateApp.formatPrice(property.price);

    const modalArea = document.getElementById('modalPropertyArea');
    if (property.area) {
        modalArea.querySelector('span').textContent = property.area + ' м²';
        modalArea.classList.remove('d-none');
    } else {
        modalArea.classList.add('d-none');
    }

    const modalRooms = document.getElementById('modalPropertyRooms');
    if (property.rooms) {
        modalRooms.querySelector('span').textContent = property.rooms;
        modalRooms.classList.remove('d-none');
    } else {
        modalRooms.classList.add('d-none');
    }

    const modalAmenities = document.getElementById('modalPropertyAmenities');
    const amenitiesList = document.getElementById('modalAmenitiesList');
    if (property.amenities && property.amenities.length > 0) {
        amenitiesList.innerHTML = property.amenities.map(amenity =>
            `<span class="badge bg-light text-dark me-1 mb-1">${amenity}</span>`
        ).join('');
        modalAmenities.classList.remove('d-none');
    } else {
        modalAmenities.classList.add('d-none');
    }

    const modalElement = document.getElementById('propertyModal');
    if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    } else {
        console.error('Модальное окно не найдено');
    }
}

// обработка аренды недвижимости
function handleRental(propertyId) {
    console.log('Попытка аренды недвижимости:', propertyId);

    if (!isAuthenticated()) {
        console.log('Пользователь не авторизован, перенаправляем на страницу входа');

        localStorage.setItem('pending_rental', propertyId);
        localStorage.setItem('return_url', window.location.href);

        window.location.href = 'login.html';
        return;
    }

    showRentalModal(propertyId);
}

// показать модальное окно оформления аренды
function showRentalModal(propertyId) {
    console.log('Показ модального окна аренды для:', propertyId);

    const property = getPropertyById(propertyId);
    if (!property) {
        console.error('Недвижимость не найдена:', propertyId);
        return;
    }

    const rentalModal = new bootstrap.Modal(document.getElementById('rentalModal'));
    const modalBody = document.getElementById('rentalModalBody');

    const user = authManager.getCurrentUser();

    modalBody.innerHTML = `
        <div class="rental-property-info mb-4">
            <h5>Оформление аренды</h5>
            <div class="property-card bg-light p-3 rounded">
                <h6>${property.title}</h6>
                <p class="mb-1"><strong>Адрес:</strong> ${property.location}</p>
                <p class="mb-1"><strong>Цена:</strong> ${property.price} ₽/${property.rentalType === 'daily' ? 'день' : 'мес'}</p>
                <p class="mb-0"><strong>Тип:</strong> ${window.propertyTypeMap[property.propertyType]}</p>
            </div>
        </div>
        
        <form id="rentalForm">
            <div class="mb-3">
                <label for="rentalStartDate" class="form-label">Дата начала аренды</label>
                <input type="date" class="form-control" id="rentalStartDate" required>
            </div>
            
            <div class="mb-3">
                <label for="rentalDuration" class="form-label">Срок аренды</label>
                <select class="form-select" id="rentalDuration" required>
                    <option value="">Выберите срок</option>
                    ${property.rentalType === 'daily' ? `
                        <option value="1">1 день</option>
                        <option value="3">3 дня</option>
                        <option value="7">7 дней</option>
                        <option value="14">14 дней</option>
                    ` : `
                        <option value="1">1 месяц</option>
                        <option value="3">3 месяца</option>
                        <option value="6">6 месяцев</option>
                        <option value="12">12 месяцев</option>
                    `}
                </select>
            </div>
            
            <div class="mb-3">
                <label for="tenantName" class="form-label">ФИО арендатора</label>
                <input type="text" class="form-control" id="tenantName" required 
                       value="${user.username}">
            </div>
            
            <div class="mb-3">
                <label for="tenantPhone" class="form-label">Телефон</label>
                <input type="tel" class="form-control" id="tenantPhone" required 
                       placeholder="+7 (XXX) XXX-XX-XX">
            </div>
            
            <div class="mb-3">
                <label for="tenantEmail" class="form-label">Email</label>
                <input type="email" class="form-control" id="tenantEmail" required 
                       value="${user.email}">
            </div>
            
            <div class="form-check mb-3">
                <input class="form-check-input" type="checkbox" id="agreeTerms" required>
                <label class="form-check-label" for="agreeTerms">
                    Я согласен с условиями аренды и политикой конфиденциальности
                </label>
            </div>
            
            <div class="d-grid">
                <button type="submit" class="btn btn-primary">Подтвердить аренду</button>
            </div>
        </form>
    `;

    const startDateInput = document.getElementById('rentalStartDate');
    const today = new Date().toISOString().split('T')[0];
    startDateInput.min = today;
    startDateInput.value = today;

    const rentalForm = document.getElementById('rentalForm');
    rentalForm.addEventListener('submit', function(e) {
        e.preventDefault();
        processRental(property, rentalForm);
    });

    rentalModal.show();
}

// обработка оформления аренды
function processRental(property, form) {
    const formData = {
        startDate: document.getElementById('rentalStartDate').value,
        duration: document.getElementById('rentalDuration').value,
        tenantName: document.getElementById('tenantName').value,
        tenantPhone: document.getElementById('tenantPhone').value,
        tenantEmail: document.getElementById('tenantEmail').value,
        agreeTerms: document.getElementById('agreeTerms').checked
    };

    if (!formData.agreeTerms) {
        alert('Необходимо согласие с условиями аренды');
        return;
    }

    if (!formData.duration) {
        alert('Выберите срок аренды');
        return;
    }

    console.log('Оформление аренды:', {
        property: property.title,
        ...formData,
        user: authManager.getCurrentUser()
    });

    const user = authManager.getCurrentUser();
    const application = createRentalApplication(property.id, user.id, formData);

    const rentalModal = bootstrap.Modal.getInstance(document.getElementById('rentalModal'));
    if (rentalModal) {
        rentalModal.hide();
    }

    setTimeout(() => {
        const durationText = property.rentalType === 'daily' ?
            `${formData.duration} ${getDayText(formData.duration)}` :
            `${formData.duration} ${getMonthText(formData.duration)}`;

        alert(`Заявка на аренду отправлена!\n\nНедвижимость: ${property.title}\nСрок: ${durationText}\nНачало: ${formData.startDate}\n\nСтатус: Ожидает подтверждения владельца`);
    }, 500);
}

// начать чат с арендодателем
function startChat(propertyId) {
    console.log('Начало чата для недвижимости:', propertyId);

    if (!isAuthenticated()) {
        console.log('Пользователь не авторизован, перенаправляем на страницу входа');
        localStorage.setItem('pending_chat', propertyId);
        localStorage.setItem('return_url', window.location.href);
        window.location.href = 'login.html';
        return;
    }

    const property = getPropertyById(propertyId);
    if (!property) {
        console.error('Недвижимость не найдена:', propertyId);
        alert('Ошибка: недвижимость не найдена');
        return;
    }

    const user = authManager.getCurrentUser();
    const chat = getOrCreateChat(propertyId, user.id, property.ownerId);

    const modal = bootstrap.Modal.getInstance(document.getElementById('propertyModal'));
    if (modal) {
        modal.hide();
    }

    setTimeout(() => {
        window.location.href = `chats.html?chatId=${chat.id}`;
    }, 500);
}

// обработка успешного входа для аренды
function handlePostLoginRental() {
    const pendingRental = localStorage.getItem('pending_rental');
    if (pendingRental && isAuthenticated()) {
        console.log('Продолжение аренды после входа:', pendingRental);
        showRentalModal(parseInt(pendingRental));
        localStorage.removeItem('pending_rental');
    }
}

// обработка успешного входа для чата
function handlePostLoginChat() {
    const pendingChat = localStorage.getItem('pending_chat');
    if (pendingChat && isAuthenticated()) {
        console.log('Продолжение чата после входа:', pendingChat);
        startChat(parseInt(pendingChat));
        localStorage.removeItem('pending_chat');
    }
}

// обработчик формы поиска
if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const filters = {
            location: document.getElementById('location').value.trim(),
            propertyType: document.getElementById('propertyType').value,
            rentalType: document.getElementById('rentalType').value,
            minPrice: document.getElementById('minPrice').value,
            maxPrice: document.getElementById('maxPrice').value
        };

        const filteredProperties = filterProperties(getAllProperties(), filters);
        displayProperties(filteredProperties);
    });
}

// обработчик сброса фильтров
if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', function() {
        if (searchForm) {
            searchForm.reset();
        }
        displayProperties(getAllProperties());
    });
}

// делегирование событий для динамически созданных элементов
function setupEventDelegation() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-details')) {
            const propertyId = e.target.getAttribute('data-property-id');
            console.log('Нажата кнопка Подробнее для объекта:', propertyId);
            showPropertyDetails(parseInt(propertyId));
            return;
        }

        if (e.target.classList.contains('btn-primary') &&
            e.target.closest('.modal-footer') &&
            e.target.textContent.includes('Арендовать')) {

            const modalTitle = document.getElementById('modalPropertyTitle');
            if (modalTitle) {
                const propertyId = modalTitle.getAttribute('data-property-id');
                if (propertyId) {
                    handleRental(parseInt(propertyId));
                }
            }
        }

        if (e.target.classList.contains('btn-outline-primary') &&
            e.target.closest('.modal-footer') &&
            (e.target.textContent.includes('Начать чат') || e.target.querySelector('i.bi-chat'))) {

            const modalTitle = document.getElementById('modalPropertyTitle');
            if (modalTitle) {
                const propertyId = modalTitle.getAttribute('data-property-id');
                if (propertyId) {
                    startChat(parseInt(propertyId));
                }
            }
        }
    });
}

// глобальные функции для модальных окон
window.startChatFromModal = function() {
    const modalTitle = document.getElementById('modalPropertyTitle');
    if (modalTitle) {
        const propertyId = modalTitle.getAttribute('data-property-id');
        if (propertyId) {
            startChat(parseInt(propertyId));
        }
    }
};

window.rentFromModal = function() {
    const modalTitle = document.getElementById('modalPropertyTitle');
    if (modalTitle) {
        const propertyId = modalTitle.getAttribute('data-property-id');
        if (propertyId) {
            handleRental(parseInt(propertyId));
        }
    }
};

// экспорт глобальных функций
window.handleRental = handleRental;
window.showRentalModal = showRentalModal;
window.handlePostLoginRental = handlePostLoginRental;
window.showPropertyDetails = showPropertyDetails;
window.displayProperties = displayProperties;
window.startChat = startChat;
window.handlePostLoginChat = handlePostLoginChat;

// инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Загрузка главной страницы...');
    console.log('MOCK_PROPERTIES доступны:', !!window.MOCK_PROPERTIES);
    console.log('Количество объектов:', window.MOCK_PROPERTIES ? window.MOCK_PROPERTIES.length : 0);

    setupEventDelegation();

    if (propertiesList) {
        displayProperties();
    }
});