const API_URL = 'http://localhost:3000/listings';

window.currentListings = [];

async function loadListings() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();

        window.currentListings = data;
        renderProperties(data);

    } catch (err) {
        console.error('Ошибка загрузки объявлений', err);
    }
}

function renderProperties(listings) {
    const grid = document.getElementById('listingsGrid');
    const empty = document.getElementById('emptyState');
    if (!grid) return;

    grid.innerHTML = '';

    if (!listings || listings.length === 0) {
        empty.classList.remove('d-none');
        return;
    } else {
        empty.classList.add('d-none');
    }

    const user = JSON.parse(localStorage.getItem('currentUser')) || { id: 2, username: 'Иван' };

    listings.forEach(listing => {
        const col = document.createElement('div');
        col.className = 'col-md-4';

        let actionButton = '';
        if (listing.ownerId === user.id) {
            actionButton = `<a href="edit-property.html?id=${listing.id}" class="btn btn-outline-dark w-100">Редактировать</a>`;
        } else {
            actionButton = `<button class="btn btn-dark w-100" onclick="bookProperty(${listing.id})">Забронировать</button>`;
        }

        col.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${listing.image}" class="card-img-top" alt="${listing.title}" style="height:200px;object-fit:cover;">
                <div class="card-body">
                    <h5 class="card-title">${listing.title}</h5>
                    <p class="card-text text-muted">${listing.address}</p>
                    <p class="fw-semibold">${listing.price} ₽ / ${listing.period}</p>
                    ${actionButton}
                </div>
            </div>
        `;

        grid.appendChild(col);
    });
}

document.getElementById('filterForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const location = document.getElementById('filterLocation').value.toLowerCase();
    const type = document.getElementById('filterType').value;
    const period = document.getElementById('filterPeriod').value;
    const priceFrom = parseInt(document.getElementById('priceFrom').value) || 0;
    const priceTo = parseInt(document.getElementById('priceTo').value) || Infinity;

    const filtered = window.currentListings.filter(l => {
        return (!location || l.address.toLowerCase().includes(location)) &&
            (!type || l.type === type) &&
            (!period || l.period === period) &&
            l.price >= priceFrom && l.price <= priceTo;
    });

    renderProperties(filtered);
});

document.getElementById('clearFilters').addEventListener('click', function() {
    document.getElementById('filterForm').reset();
    renderProperties(window.currentListings);
});

function bookProperty(id) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) return alert('Сначала войдите в систему.');

    let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.push({ propertyId: id, userId: user.id, date: Date.now() });
    localStorage.setItem('bookings', JSON.stringify(bookings));

    alert('Жильё забронировано!');
}

window.bookProperty = bookProperty;

document.addEventListener('DOMContentLoaded', loadListings);
