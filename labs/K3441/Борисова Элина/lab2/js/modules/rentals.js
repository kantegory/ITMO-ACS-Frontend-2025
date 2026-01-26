console.log('rentals.js loaded');

window.MOCK_RENTALS = [
    {
        id: 1,
        listingId: 1,
        userId: 2,
        startDate: '2025-12-20',
        endDate: '2025-12-25',
        status: 'confirmed'
    },
    {
        id: 2,
        listingId: 3,
        userId: 2,
        startDate: '2025-12-28',
        endDate: '2025-12-30',
        status: 'pending'
    }
];

function getUserRentals(userId) {
    return window.MOCK_RENTALS
        .filter(r => r.userId === userId)
        .map(r => {
            const listing = window.MOCK_LISTINGS.find(l => l.id === r.listingId);
            return { ...r, listing };
        });
}

function getUserListings(userId) {
    return window.MOCK_LISTINGS.filter(l => l.ownerId === userId || l.id === 1 || l.id === 2);
}

function renderUserProfile() {
    const user = JSON.parse(localStorage.getItem('currentUser')) || { id: 2, username: 'Иван', email: 'ivan@mail.com' };

    document.getElementById('profileName').textContent = user.username;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('profileAvatar').textContent = user.username[0].toUpperCase();

    const rentalsContainer = document.getElementById('rentalsContainer');
    const rentals = getUserRentals(user.id);

    if (!rentals.length) {
        rentalsContainer.innerHTML = `<p class="text-muted">Нет бронирований</p>`;
    } else {
        rentalsContainer.innerHTML = rentals.map(r => `
            <div class="card mb-3 shadow-sm">
                <div class="card-body">
                    <h6 class="card-title">${r.listing.title}</h6>
                    <p class="mb-1"><strong>Адрес:</strong> ${r.listing.address}</p>
                    <p class="mb-1"><strong>Период:</strong> ${r.startDate} – ${r.endDate}</p>
                    <p class="mb-0"><strong>Статус:</strong> ${r.status}</p>
                </div>
            </div>
        `).join('');
    }

    const listingsContainer = document.getElementById('listingsContainer');
    const listings = getUserListings(user.id);

    if (!listings.length) {
        listingsContainer.innerHTML = `<p class="text-muted">Нет объектов</p>`;
    } else {
        listingsContainer.innerHTML = listings.map(l => `
            <div class="card mb-3 shadow-sm">
                <img src="${l.image}" class="card-img-top" alt="${l.title}">
                <div class="card-body">
                    <h6 class="card-title">${l.title}</h6>
                    <p class="mb-1"><strong>Адрес:</strong> ${l.address}</p>
                    <p class="mb-1"><strong>Цена:</strong> ${l.price} ₽ / ${l.period}</p>
                    <p class="mb-0">${l.description}</p>
                </div>
            </div>
        `).join('');
    }
}

document.addEventListener('DOMContentLoaded', renderUserProfile);

window.renderUserProfile = renderUserProfile;
window.getUserRentals = getUserRentals;
window.getUserListings = getUserListings;
