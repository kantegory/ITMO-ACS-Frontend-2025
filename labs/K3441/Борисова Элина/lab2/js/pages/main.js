document.addEventListener('DOMContentLoaded', function() {
    const list = document.getElementById('propertiesList');
    const noResults = document.getElementById('noResults');

    function renderProperties(properties) {
        list.innerHTML = '';

        if (!properties || properties.length === 0) {
            noResults.classList.remove('d-none');
            return;
        }

        noResults.classList.add('d-none');

        properties.forEach(p => {
            const card = document.createElement('div');
            card.className = 'col-md-4 mb-4';
            card.innerHTML = `
                <div class="card h-100">
                    <img src="${p.image}" class="card-img-top" alt="${p.title}">
                    <div class="card-body">
                        <h5 class="card-title">${p.title}</h5>
                        <p class="card-text">${p.description}</p>
                        <p><strong>Цена:</strong> ${p.price} ₽</p>
                        <p><strong>Тип аренды:</strong> ${p.rentalType}</p>
                        <p><strong>Местоположение:</strong> ${p.location}</p>
                    </div>
                </div>
            `;
            list.appendChild(card);
        });
    }

    renderProperties(window.MOCK_PROPERTIES);

    const searchForm = document.getElementById('searchForm');
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const location = document.getElementById('location').value.trim().toLowerCase();
        const type = document.getElementById('propertyType').value;
        const rentalType = document.getElementById('rentalType').value;
        const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
        const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;

        const filtered = window.MOCK_PROPERTIES.filter(p => {
            return (!location || p.location.toLowerCase().includes(location)) &&
                (!type || p.type === type) &&
                (!rentalType || p.rentalType === rentalType) &&
                p.price >= minPrice &&
                p.price <= maxPrice;
        });

        renderProperties(filtered);
    });

    document.getElementById('resetFilters').addEventListener('click', function() {
        searchForm.reset();
        renderProperties(window.MOCK_PROPERTIES);
    });
});
document.addEventListener('DOMContentLoaded', function () {
    const grid = document.getElementById('listingsGrid');
    const empty = document.getElementById('emptyState');

    function renderListings(listings) {
        grid.innerHTML = '';
        if (!listings || listings.length === 0) {
            empty.classList.remove('d-none');
            return;
        }
        empty.classList.add('d-none');

        listings.forEach(l => {
            const col = document.createElement('div');
            col.className = 'col-md-4';
            col.innerHTML = `
        <div class="card h-100">
          <img src="${l.image}" class="card-img-top" alt="${l.title}">
          <div class="card-body">
            <h5 class="card-title">${l.title}</h5>
            <p class="card-text">${l.description}</p>
            <p><strong>Цена:</strong> ${l.price} ₽</p>
            <p><strong>Тип:</strong> ${l.type}</p>
            <p><strong>Период:</strong> ${l.period}</p>
            <p><strong>Локация:</strong> ${l.location}</p>
          </div>
        </div>
      `;
            grid.appendChild(col);
        });
    }

    renderListings(window.MOCK_LISTINGS);
});
