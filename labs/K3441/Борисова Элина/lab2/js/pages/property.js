document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { id: null };

    const urlParams = new URLSearchParams(window.location.search);
    const listingId = parseInt(urlParams.get('id'));

    const listing = window.MOCK_LISTINGS.find(l => l.id === listingId);

    if (!listing) {
        console.error('Объявление не найдено');
        return;
    }

    const isOwner = currentUser.id === listing.ownerId;

    const editButtons = document.querySelectorAll('button[onclick*="editListing"], a[href*="edit-property"]');
    const deleteButtons = document.querySelectorAll('button[onclick*="removeListing"]');
    const actionButtons = document.querySelectorAll('.card-header .btn-group, .card-body .btn[onclick*="editListing"]');

    if (!isOwner) {
        editButtons.forEach(btn => btn.style.display = 'none');
        deleteButtons.forEach(btn => btn.style.display = 'none');
        actionButtons.forEach(btn => btn.style.display = 'none');

        const actionSection = document.querySelector('.card-body .d-grid');
        if (actionSection) {
            const buttonsToHide = actionSection.querySelectorAll('button[onclick*="editListing"]');
            buttonsToHide.forEach(btn => btn.style.display = 'none');
        }

        const bookBtn = document.querySelector('button[onclick="bookProperty()"]');
        if (bookBtn && !currentUser.id) {
            bookBtn.textContent = 'Войдите, чтобы забронировать';
            bookBtn.onclick = () => {
                window.location.href = 'login.html';
            };
        }
    } else {
        editButtons.forEach(btn => btn.style.display = '');
        deleteButtons.forEach(btn => btn.style.display = '');
        actionButtons.forEach(btn => btn.style.display = '');
    }

    renderPropertyDetails(listing);
});

function renderPropertyDetails(listing) {
    document.getElementById('listingTitle').textContent = listing.title;
    document.getElementById('listingImage').src = listing.image;
    document.getElementById('listingAddress').textContent = listing.address;
    document.getElementById('listingType').textContent = getPropertyTypeText(listing.type);
    document.getElementById('listingRentType').textContent = getRentTypeText(listing.period);
    document.getElementById('listingPrice').textContent = `${listing.price} ₽ / ${getRentTypeText(listing.period)}`;
    document.getElementById('listingArea').textContent = `${listing.area} м²`;
    document.getElementById('listingRooms').textContent = listing.rooms;
    document.getElementById('listingDescription').textContent = listing.description;

    const featuresList = document.getElementById('featuresList');
    featuresList.innerHTML = '';
    listing.features.forEach(feature => {
        const span = document.createElement('span');
        span.className = 'badge bg-secondary';
        span.textContent = feature;
        featuresList.appendChild(span);
    });
}

function getPropertyTypeText(type) {
    const types = {
        'apartment': 'Квартира',
        'house': 'Дом',
        'room': 'Комната'
    };
    return types[type] || type;
}

function getRentTypeText(period) {
    const periods = {
        'daily': 'сутки',
        'monthly': 'месяц',
        'longterm': 'долгосрочно'
    };
    return periods[period] || period;
}

function bookProperty() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Для бронирования необходимо войти в систему');
        window.location.href = 'login.html';
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const listingId = parseInt(urlParams.get('id'));
    const listing = window.MOCK_LISTINGS.find(l => l.id === listingId);

    if (!listing) {
        alert('Объявление не найдено');
        return;
    }

    if (currentUser.id === listing.ownerId) {
        alert('Вы не можете забронировать собственное объявление');
        return;
    }

    let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.push({
        propertyId: listingId,
        userId: currentUser.id,
        date: new Date().toISOString(),
        status: 'pending'
    });
    localStorage.setItem('bookings', JSON.stringify(bookings));

    alert('Запрос на бронирование отправлен!');
}

function editListing(listingId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const listing = window.MOCK_LISTINGS.find(l => l.id === listingId);

    if (!currentUser || currentUser.id !== listing.ownerId) {
        alert('У вас нет прав для редактирования этого объявления');
        return;
    }

    window.location.href = `edit-property.html?id=${listingId}`;
}

function removeListing(listingId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const listing = window.MOCK_LISTINGS.find(l => l.id === listingId);

    if (!currentUser || currentUser.id !== listing.ownerId) {
        alert('У вас нет прав для удаления этого объявления');
        return;
    }

    if (confirm('Вы уверены, что хотите удалить это объявление?')) {
        const index = window.MOCK_LISTINGS.findIndex(l => l.id === listingId);
        if (index !== -1) {
            window.MOCK_LISTINGS.splice(index, 1);
        }

        alert('Объявление удалено');
        window.location.href = 'index.html';
    }
}