async function loadListings() {
    const listingsContainer = document.getElementById('listings');
    const resultsCount = document.getElementById('resultsCount');
    
    if (!listingsContainer) return;

    try {
        listingsContainer.innerHTML = '<div class="col-12"><div class="text-center">Загрузка...</div></div>';
        
        const listings = await listingsAPI.getAll();
        
        listingsContainer.innerHTML = '';
        
        if (listings.length === 0) {
            listingsContainer.innerHTML = '<div class="col-12"><div class="text-center">Объявления не найдены</div></div>';
            if (resultsCount) resultsCount.textContent = '0 найдено';
            return;
        }

        listings.forEach(listing => {
            const card = createListingCard(listing);
            listingsContainer.appendChild(card);
        });

        if (resultsCount) {
            resultsCount.textContent = `${listings.length} найдено`;
        }

        applyFiltersToLoadedListings();
        initDetailModals();
    } catch (error) {
        console.error('Error loading listings:', error);
        const errorMessage = error.message || 'Ошибка загрузки объявлений';
        listingsContainer.innerHTML = `<div class="col-12"><div class="alert alert-danger">${errorMessage}</div></div>`;
        if (resultsCount) resultsCount.textContent = 'Ошибка';
    }
}

function createListingCard(listing) {
    const col = document.createElement('div');
    col.className = 'col-md-6';
    col.setAttribute('data-type', listing.type);
    col.setAttribute('data-price', listing.price);
    col.setAttribute('data-location', listing.location);
    col.setAttribute('data-id', listing.id);
    col.setAttribute('role', 'listitem');

    const imageAlt = listing.title || `Изображение недвижимости: ${listing.type}`;
    const priceText = `${listing.price.toLocaleString('ru-RU')} ₽ / мес`;
    const locationText = `Район: ${listing.location}`;

    col.innerHTML = `
        <article class="card h-100">
            <img src="${listing.image}" class="card-img-top" alt="${imageAlt}" loading="lazy">
            <div class="card-body">
                <h3 class="card-title h5">${listing.title}</h3>
                <p class="card-text">
                    <span aria-label="Цена аренды">${priceText}</span> · 
                    <span aria-label="Расположение">${locationText}</span>
                </p>
                <button class="btn btn-outline-primary btn-details"
                        data-id="${listing.id}"
                        data-title="${listing.title}"
                        data-info="${listing.description}"
                        aria-label="Подробнее об объявлении: ${listing.title}">
                    <svg class="icon icon-eye" aria-hidden="true"><use href="#icon-eye"></use></svg> Подробнее
                </button>
            </div>
        </article>
    `;

    return col;
}

function applyFiltersToLoadedListings() {
    const applyBtn = document.getElementById('applyFilters');
    const clearBtn = document.getElementById('clearFilters');
    
    if (!applyBtn || !clearBtn) return;

    function applyFilters() {
        const type = document.getElementById('typeFilter')?.value || 'any';
        const maxPrice = Number(document.getElementById('priceFilter')?.value) || Infinity;
        const loc = (document.getElementById('locationFilter')?.value || '').trim().toLowerCase();

        const listings = Array.from(document.querySelectorAll('#listings > [data-type]'));
        let visible = 0;

        listings.forEach(card => {
            const cardType = card.getAttribute('data-type');
            const cardPrice = Number(card.getAttribute('data-price'));
            const cardLoc = (card.getAttribute('data-location') || '').toLowerCase();

            const okType = (type === 'any') || (type === cardType);
            const okPrice = cardPrice <= maxPrice;
            const okLoc = loc === '' || cardLoc.includes(loc);

            if (okType && okPrice && okLoc) {
                card.style.display = '';
                visible++;
            } else {
                card.style.display = 'none';
            }
        });

        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            resultsCount.textContent = `${visible} найдено`;
        }
    }

    applyBtn.addEventListener('click', applyFilters);
    clearBtn.addEventListener('click', () => {
        document.getElementById('filterForm')?.reset();
        const listings = Array.from(document.querySelectorAll('#listings > [data-type]'));
        listings.forEach(c => c.style.display = '');
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            resultsCount.textContent = `${listings.length} найдено`;
        }
    });
}

function initDetailModals() {
    const detailButtons = document.querySelectorAll('.btn-details');
    detailButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const listingId = button.dataset.id;
            const title = button.dataset.title;
            const info = button.dataset.info;

            const modalTitle = document.getElementById('detailsModalLabel');
            const modalBody = document.getElementById('detailsModalBody');

            if (modalTitle) modalTitle.textContent = title;
            
            if (modalBody) {
                if (listingId) {
                    try {
                        const listing = await listingsAPI.getById(listingId);
                        modalBody.innerHTML = `
                            <p><strong>Описание:</strong> ${listing.description}</p>
                            <p><strong>Тип:</strong> ${getTypeName(listing.type)}</p>
                            <p><strong>Цена:</strong> ${listing.price.toLocaleString('ru-RU')} ₽ / мес</p>
                            <p><strong>Район:</strong> ${listing.location}</p>
                            ${listing.rooms ? `<p><strong>Комнат:</strong> ${listing.rooms}</p>` : ''}
                            ${listing.area ? `<p><strong>Площадь:</strong> ${listing.area} м²</p>` : ''}
                        `;
                    } catch (error) {
                        console.error('Error loading listing details:', error);
                        modalBody.textContent = info;
                    }
                } else {
                    modalBody.textContent = info;
                }
            }

            const modalElement = document.getElementById('detailsModal');
            if (modalElement) {
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
            }
        });
    });
}

function getTypeName(type) {
    const types = {
        'apartment': 'Квартира',
        'house': 'Дом',
        'studio': 'Студия'
    };
    return types[type] || type;
}

document.addEventListener('DOMContentLoaded', () => {
    loadListings();
});
