const API_URL = 'http://localhost:3000/listings';

async function loadListings(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const url = params ? `${API_URL}?${params}` : API_URL;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Ошибка загрузки объявлений');

        const data = await res.json();
        renderProperties(data);
    } catch (e) {
        console.error(e);
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

    listings.forEach(listing => {
        const col = document.createElement('div');
        col.className = 'col-md-4';

        col.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${listing.image}" class="card-img-top" alt="${listing.title}" style="height:200px;object-fit:cover;">
                <div class="card-body">
                    <h5 class="card-title">${listing.title}</h5>
                    <p class="card-text text-muted">${listing.address}</p>
                    <p class="fw-semibold">${listing.price} ₽ / ${listing.period}</p>
                    <a href="property-details.html?id=${listing.id}" class="btn btn-dark w-100">Подробнее</a>
                </div>
            </div>
        `;

        grid.appendChild(col);
    });
}

document.getElementById('filterForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const filters = {};

    const location = document.getElementById('filterLocation').value;
    const type = document.getElementById('filterType').value;
    const period = document.getElementById('filterPeriod').value;
    const priceFrom = document.getElementById('priceFrom').value;
    const priceTo = document.getElementById('priceTo').value;

    if (location) filters.address_like = location;
    if (type) filters.type = type;
    if (period) filters.period = period;
    if (priceFrom) filters.price_gte = priceFrom;
    if (priceTo) filters.price_lte = priceTo;

    loadListings(filters);
});

document.getElementById('clearFilters').addEventListener('click', () => {
    document.getElementById('filterForm').reset();
    loadListings();
});

document.addEventListener('DOMContentLoaded', () => {
    loadListings();
});

const themeToggle = document.getElementById('themeToggle');

if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
    if (themeToggle) themeToggle.checked = true;
}

if (themeToggle) {
    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        }
    });
}
