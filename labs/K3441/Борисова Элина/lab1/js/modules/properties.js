let activeListingId = null;

const currentUser = getCurrentUser();

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    if (!id) return;

    activeListingId = id;
    const listing = window.MOCK_LISTINGS.find(l => l.id === id);
    if (!listing) return;

    renderListingDetails(listing);
});

function renderListingDetails(listing) {
    document.getElementById('listingTitle').textContent = listing.title;
    document.getElementById('listingAddress').textContent = listing.address;
    document.getElementById('listingType').textContent = listing.type;
    document.getElementById('listingRentType').textContent = listing.period;
    document.getElementById('listingPrice').textContent = listing.price + ' ₽';
    document.getElementById('listingDescription').textContent = listing.description;
    document.getElementById('listingImage').src = listing.image;

    const featuresList = document.getElementById('featuresList');
    featuresList.innerHTML = '';
    listing.features.forEach(f => {
        const span = document.createElement('span');
        span.className = 'badge bg-secondary';
        span.textContent = f;
        featuresList.appendChild(span);
    });

    renderActionButtons(listing);
}

function renderActionButtons(listing) {
    const actionsContainer = document.querySelector('.card-body.d-grid.gap-2');
    actionsContainer.innerHTML = '';

    if (!currentUser) return;

    if (currentUser.id === listing.ownerId) {
        actionsContainer.innerHTML += `
            <button class="btn btn-dark" onclick="editListing(${listing.id})">
                <i class="bi bi-pencil"></i> Изменить
            </button>
            <button class="btn btn-outline-danger" onclick="removeListing(${listing.id})">
                <i class="bi bi-trash"></i> Удалить
            </button>
        `;
    } else {
        actionsContainer.innerHTML += `
            <button class="btn btn-success" onclick="bookListing(${listing.id})">
                <i class="bi bi-calendar-check"></i> Забронировать
            </button>
        `;
    }

    actionsContainer.innerHTML += `
        <a href="chats.html" class="btn btn-outline-dark">
            <i class="bi bi-chat-dots"></i> Сообщения
        </a>
        <a href="profile.html" class="btn btn-outline-secondary">
            <i class="bi bi-person"></i> Профиль
        </a>
    `;
}

function bookListing(listingId) {
    const user = getCurrentUser();
    if (!user) {
        alert('Сначала войдите в систему!');
        return;
    }

    const listing = window.MOCK_LISTINGS.find(l => l.id === listingId);
    if (!listing) return;

    let rentals = JSON.parse(localStorage.getItem('rentals')) || [];
    rentals.push({
        id: Date.now(),
        listingId: listing.id,
        userId: user.id,
        status: 'pending'
    });
    localStorage.setItem('rentals', JSON.stringify(rentals));
    alert('Заявка на аренду отправлена!');
}
function bookProperty() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) return alert('Войдите в систему');

    let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.push({
        propertyId: listing.id,
        userId: user.id,
        date: Date.now()
    });

    localStorage.setItem('bookings', JSON.stringify(bookings));
    alert('Жильё забронировано');
}
