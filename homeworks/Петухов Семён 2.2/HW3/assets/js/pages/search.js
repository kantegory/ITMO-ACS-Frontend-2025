(function(global){
  const FastRent = global.FastRent = global.FastRent || {};
  const pages = FastRent.pages = FastRent.pages || {};

  function renderAdvertisements(container, advertisements, utils) {
    if (!container) return;
    container.innerHTML = '';
    const list = Array.isArray(advertisements) ? advertisements : [];
    if (list.length === 0) {
      container.innerHTML = `<div class="text-muted p-4 bg-white card-custom" role="status">Объявления не найдены.</div>`;
      return;
    }
    const { normalizeId, statusText } = utils;
    list.forEach((prop) => {
      const cover = prop.images && prop.images.length ? prop.images[0] : 'https://via.placeholder.com/600x400?text=No+image';
      const propId = normalizeId(prop.id) || prop.id;
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-4 mb-4';
      col.setAttribute('role', 'listitem');
      col.setAttribute('aria-label', `${prop.title}, ${prop.location}`);
      col.innerHTML = `
        <div class="card card-custom h-100">
          <img src="${cover}" class="property-img w-100" alt="${prop.title}">
          <div class="property-card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h6 class="mb-1">${prop.title}</h6>
                <div class="property-meta">${prop.location} • ${prop.type} • ${prop.beds} спал. • ${prop.baths} ван.</div>
              </div>
              <div class="text-end">
                <div class="h6 mb-1">₽${prop.price}/мес</div>
                <div class="badge-ghost">${statusText(prop.status)}</div>
              </div>
            </div>
            <p class="mt-2 mb-2 text-muted small">${(prop.description || '').slice(0, 90)}...</p>
            <div class="d-flex justify-content-between">
              <button class="btn btn-sm btn-outline-primary view-btn" data-id="${propId}">Посмотреть</button>
              <button class="btn btn-sm btn-primary book-btn" data-id="${propId}" ${prop.status !== 'available' ? 'disabled' : ''}>Забронировать</button>
            </div>
          </div>
        </div>
      `;
      container.appendChild(col);
    });

    container.querySelectorAll('.view-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = utils.normalizeId(btn.getAttribute('data-id'));
        if (!id) return;
        window.location = `property.html?id=${id}`;
      });
    });
    container.querySelectorAll('.book-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = utils.normalizeId(btn.getAttribute('data-id'));
        if (!id) return;
        const modalEl = document.getElementById('bookModal');
        if (!modalEl) return;
        const bookModal = new bootstrap.Modal(modalEl);
        document.getElementById('bookModalLabel').textContent = `Бронирование объявления #${id}`;
        document.getElementById('bookPropertyId').value = id;
        bookModal.show();
      });
    });
  }

  async function initSearchPage() {
    const services = FastRent.dataService;
    if (!services) return;
    const { fetchAdvertisement, normalizeId, statusText } = services;
    const container = document.getElementById('propertiesContainer');
    const searchInput = document.getElementById('searchInput');
    const typeSelect = document.getElementById('filterType');
    const priceRange = document.getElementById('filterPrice');
    const locationSelect = document.getElementById('filterLocation');
    const priceLabel = document.getElementById('priceLabel');
    const paginationControls = document.getElementById('paginationControls');
    const paginationStatus = document.getElementById('paginationStatus');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const resultCounter = document.getElementById('resultCount');

    const PAGE_SIZE = 6;
    let currentPage = 1;
    let totalItems = 0;

    function updatePriceLabel() {
      if (priceLabel) {
        priceLabel.textContent = `₽${priceRange.value}`;
      }
    }

    async function populateFilters() {
      const raw = await fetchAdvertisement();
      const dataset = Array.isArray(raw) ? raw : Array.isArray(raw?.items) ? raw.items : [];
      const types = Array.from(new Set(dataset.map((p) => p.type).filter(Boolean))).sort();
      types.forEach((t) => typeSelect.appendChild(new Option(t, t)));
      const locs = Array.from(new Set(dataset.map((p) => p.location).filter(Boolean))).sort();
      locs.forEach((l) => locationSelect.appendChild(new Option(l, l)));

      const maxPriceValue = dataset.reduce((acc, p) => Math.max(acc, Number(p.price) || 0), 0) || 5000;
      priceRange.min = 0;
      priceRange.max = Math.max(maxPriceValue, 1000);
      if (!priceRange.value) {
        priceRange.value = Math.min(3000, priceRange.max);
      } else if (Number(priceRange.value) > priceRange.max) {
        priceRange.value = priceRange.max;
      }
      updatePriceLabel();
    }

    function buildFilterParams() {
      const params = {};
      const q = searchInput.value.trim();
      if (q) params.q = q;
      if (typeSelect.value) params.type = typeSelect.value;
      if (locationSelect.value) params.location = locationSelect.value;
      const maxPrice = parseInt(priceRange.value, 10);
      if (!Number.isNaN(maxPrice) && maxPrice > 0) params.price_lte = maxPrice;
      return params;
    }

    function updateResultCount(total) {
      if (resultCounter) {
        resultCounter.textContent = `Найдено: ${total}`;
      }
    }

    function renderPagination() {
      const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
      if (!paginationControls) return;
      paginationControls.classList.toggle('d-none', totalPages <= 1);
      if (paginationStatus) {
        paginationStatus.textContent = `Страница ${Math.min(currentPage, totalPages)} из ${totalPages}`;
      }
      if (prevBtn) prevBtn.disabled = currentPage <= 1;
      if (nextBtn) nextBtn.disabled = currentPage >= totalPages;
    }

    async function loadPage(page = 1) {
      updatePriceLabel();
      const { items, total } = await fetchAdvertisement({
        page,
        limit: PAGE_SIZE,
        filters: buildFilterParams(),
        withMeta: true
      }) || { items: [], total: 0 };
      currentPage = page;
      totalItems = total || 0;
      renderAdvertisements(container, Array.isArray(items) ? items : [], { normalizeId, statusText });
      updateResultCount(totalItems);
      renderPagination();
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
          loadPage(currentPage - 1);
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
        if (currentPage < totalPages) {
          loadPage(currentPage + 1);
        }
      });
    }

    [searchInput, typeSelect, priceRange, locationSelect].forEach((el) => {
      if (!el) return;
      el.addEventListener('input', () => {
        loadPage(1);
      });
    });

    await populateFilters();
    await loadPage(1);
  }

  pages.search = initSearchPage;
})(window);
