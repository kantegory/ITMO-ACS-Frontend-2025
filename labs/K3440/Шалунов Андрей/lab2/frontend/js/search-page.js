import { fetchProperties } from './properties.js';
import { isLoggedIn  } from './session.js';
import { logout } from './auth.js';
import { apiGet } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    if (!isLoggedIn()) {
        window.location.href = 'signin.html';
        return;
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
            window.location.href = 'signin.html';
        });
    }

    const typeSelect = document.getElementById('filterType');
    const citySelect = document.getElementById('filterCity');
    const minPriceInput = document.getElementById('filterMinPrice');
    const maxPriceInput = document.getElementById('filterMaxPrice');

    const applyBtn = document.getElementById('applyFilters');
    const resetBtn = document.getElementById('resetFilters');
    const listEl = document.getElementById('propertyList');

    const TYPE_LABELS = {
        flat: 'Квартира',
        house: 'Дом',
        room: 'Комната'
    };

    function getFiltersFromForm() {
        return {
            type: typeSelect?.value || 'all',
            city: citySelect?.value || 'all',
            minPrice: minPriceInput?.value || '',
            maxPrice: maxPriceInput?.value || ''
        };
    }

    async function loadProperties(filters = {}) {
        if (!listEl) return;

        listEl.innerHTML = '<p class="text-muted">Загружаем объявления...</p>';

        try {
            const data = await fetchProperties(filters);
            const withPhotos = await Promise.all(
                data.map(async p => {
                    try {
                        const photos = await apiGet(`/photos/by-property/${p.property_id}`, { auth: true });
                        const firstPhoto = Array.isArray(photos) && photos.length > 0 ? photos[0].photo_url : null;
                        return { ...p, main_photo_url: firstPhoto };
                    } catch {
                        return { ...p, main_photo_url: null };
                    }
                })
            );

            renderProperties(withPhotos || []);
        } catch (err) {
            console.error(err);
            listEl.innerHTML = '<p class="text-danger">Не удалось загрузить объявления.</p>';
        }
    }

    function applyFilters(event) {
        if (event) event.preventDefault();
        const filters = getFiltersFromForm();
        loadProperties(filters);
    }

    function resetFilters(event) {
        if (event) event.preventDefault();

        if (typeSelect) typeSelect.value = 'all';
        if (citySelect) citySelect.value = 'all';
        if (minPriceInput) minPriceInput.value = '';
        if (maxPriceInput) maxPriceInput.value = '';

        loadProperties({});
    }

    function renderProperties(properties) {
        if (!listEl) return;

        if (!properties.length) {
            listEl.innerHTML = '<p>Объявлений не найдено.</p>';
            return;
        }

        listEl.innerHTML = '';

        properties.forEach(p => {
            const col = document.createElement('div');
            col.className = 'col-12 col-md-4 mb-3';

            const card = document.createElement('div');
            card.className = 'card h-100 shadow-sm';

            const img = document.createElement('img');
            img.className = 'card-img-top';
            img.alt = 'Фото недвижимости';
            img.src = p.main_photo_url || 'https://via.placeholder.com/400x250?text=Нет+фото';

            const body = document.createElement('div');
            body.className = 'card-body d-flex flex-column';

            const title = document.createElement('h5');
            title.className = 'card-title';
            title.textContent = p.title || 'Объявление без названия';

            const typeP = document.createElement('p');
            typeP.className = 'card-text mb-1';
            const typeLabel = TYPE_LABELS[p.type] || p.type || '—';
            typeP.textContent = `Тип: ${typeLabel}`;

            const cityP = document.createElement('p');
            cityP.className = 'card-text mb-1';
            const city = p.location || '—';
            cityP.textContent = `Город: ${city}`;

            const priceP = document.createElement('p');
            priceP.className = 'card-text mb-1';
            const price = p.price_per_day != null ? Number(p.price_per_day) : 0;
            priceP.textContent = `Цена: ${price} ₽/день`;

            const btn = document.createElement('a');
            btn.className = 'btn btn-sm btn-outline-primary mt-auto w-auto align-self-start';
            btn.textContent = 'Подробнее';
            btn.href = `property.html?id=${p.property_id}`;
            
            body.appendChild(title);
            body.appendChild(typeP);
            body.appendChild(cityP);
            body.appendChild(priceP);
            body.appendChild(btn);

            card.appendChild(img);
            card.appendChild(body);
            col.appendChild(card);
            listEl.appendChild(col);
        });
    }

    if (applyBtn) applyBtn.addEventListener('click', applyFilters);
    if (resetBtn) resetBtn.addEventListener('click', resetFilters);

    loadProperties({});
});