let property = null;

// Загрузка данных и инициализация
async function loadProperty() {
    await ApartmentService.loadApartments();
    
    // Получение ID из URL
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = parseInt(urlParams.get('id')) || 1;
    property = await ApartmentService.getApartmentById(propertyId);
    
    if (!property) {
        // Если не найдено, берем первую
        const apartments = ApartmentService.getApartments();
        property = apartments.length > 0 ? apartments[0] : null;
    }
    
    if (property) {
        renderProperty();
    }
}

function renderProperty() {
    // Заполнение галереи
    const carouselInner = document.getElementById('carouselInner');
    property.images.forEach((image, index) => {
        const item = document.createElement('div');
        item.className = `carousel-item ${index === 0 ? 'active' : ''}`;
        item.innerHTML = `<img src="${image}" class="d-block w-100" alt="Фотография ${index + 1} из ${property.images.length}: ${property.title}, ${property.location}" style="height: 500px; object-fit: cover;">`;
        carouselInner.appendChild(item);
    });

    // Заполнение информации
    document.getElementById('propertyTitle').textContent = property.title;
    document.getElementById('propertyLocation').textContent = property.location;
    document.getElementById('propertyPrice').textContent = `${property.price.toLocaleString()} ₽/мес`;
    document.getElementById('propertyDescription').textContent = property.description;

    // Характеристики
    const featuresList = document.getElementById('propertyFeatures');
    const typeNames = {
        apartment: 'Квартира',
        house: 'Дом',
        office: 'Офис',
        studio: 'Студия'
    };
    featuresList.innerHTML = `
        <li><strong>Тип:</strong> ${typeNames[property.type] || property.type}</li>
        <li><strong>Комнат:</strong> ${property.rooms}</li>
        <li><strong>Площадь:</strong> ${property.area} м²</li>
        <li><strong>Этаж:</strong> ${property.floor} из ${property.totalFloors}</li>
    `;

    // Условия аренды
    const conditionsList = document.getElementById('rentalConditions');
    property.conditions.forEach(condition => {
        const li = document.createElement('li');
        li.className = 'mb-2';
        li.textContent = condition;
        conditionsList.appendChild(li);
    });
}

function submitContact() {
    const name = document.getElementById('contactName').value;
    const phone = document.getElementById('contactPhone').value;
    const message = document.getElementById('contactMessage').value;
    
    if (name && phone && message) {
        const modal = bootstrap.Modal.getInstance(document.getElementById('contactModal'));
        modal.hide();
        document.getElementById('contactForm').reset();
    }
}

async function submitRent() {
    const startDate = document.getElementById('rentStartDate').value;
    const endDate = document.getElementById('rentEndDate').value;
    const guests = document.getElementById('rentGuests').value;
    
    if (startDate && endDate && guests) {
        const currentUser = UserService.getCurrentUser();
        if (!currentUser) {
            window.location.href = 'login.html';
            return;
        }
        
        // Скрываем предыдущие ошибки
        const errorElement = document.getElementById('rentError');
        if (errorElement) {
            errorElement.classList.add('d-none');
        }
        
        try {
            await ApartmentService.rentApartment(property.id, currentUser.id, {
                startDate,
                endDate,
                guests: parseInt(guests)
            });
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('rentModal'));
            modal.hide();
            document.getElementById('rentForm').reset();
            // Перенаправляем на страницу профиля после успешной аренды
            window.location.href = 'profile.html';
        } catch (error) {
            console.error('Ошибка аренды:', error);
            // Показываем ошибку в форме
            if (errorElement) {
                const errorMessage = error.response?.data?.error || 'Ошибка при оформлении аренды. Попробуйте еще раз.';
                errorElement.textContent = errorMessage;
                errorElement.classList.remove('d-none');
            }
        }
    }
}

function calculateTotal() {
    if (!property) return;
    
    const startDate = new Date(document.getElementById('rentStartDate').value);
    const endDate = new Date(document.getElementById('rentEndDate').value);
    
    if (startDate && endDate && endDate > startDate) {
        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        const months = Math.ceil(days / 30);
        const total = property.price * months;
        document.getElementById('totalAmount').textContent = total.toLocaleString();
    } else {
        document.getElementById('totalAmount').textContent = '0';
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Обновляем навигацию после загрузки main.js
    if (typeof updateNavigation === 'function') {
        updateNavigation();
    }
    
    // Расчет суммы при изменении дат
    const rentStartDate = document.getElementById('rentStartDate');
    const rentEndDate = document.getElementById('rentEndDate');
    
    if (rentStartDate) {
        rentStartDate.addEventListener('change', calculateTotal);
    }
    if (rentEndDate) {
        rentEndDate.addEventListener('change', calculateTotal);
    }
    
    // Загружаем данные о недвижимости
    loadProperty();
});

