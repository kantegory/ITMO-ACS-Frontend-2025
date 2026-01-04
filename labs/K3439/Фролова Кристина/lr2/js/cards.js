const resultsContainerId = 'results';

export function renderCards(cards) {
  const container = document.getElementById(resultsContainerId);
  if (!container) return;

  container.innerHTML = '';

  if (!cards || cards.length === 0) {
    container.innerHTML = '<p class="text-muted">Объявлений не найдено.</p>';
    return;
  }

  cards.forEach(card => {
    const col = document.createElement('div');
    col.className = 'col-md-4 property-card';
    col.dataset.type = card.type ?? '';
    col.dataset.price = card.price ?? 0;
    col.dataset.location = (card.location ?? '').toString();

    col.innerHTML = `
      <div class="card h-100">
        <img src="${card.image || 'https://picsum.photos/400/250'}"
             class="card-img-top"
             alt="${escapeHtml(card.title)}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${escapeHtml(card.title)}</h5>
          <p class="card-text mb-1">${escapeHtml(card.address ?? '')}</p>
          <p class="card-text fw-bold mb-2">${card.priceText}</p>
          <p class="card-text small text-muted">${escapeHtml(card.description ?? '')}</p>

          <div class="mt-auto d-flex justify-content-between">
            <a href="property.html?id=${encodeURIComponent(card.id)}"
               class="btn btn-outline-primary btn-sm">
              Подробнее
            </a>
            <button class="btn btn-sm btn-secondary"
                    data-bs-toggle="modal"
                    data-bs-target="#contactModal">
              Написать владельцу
            </button>
          </div>
        </div>
      </div>
    `;

    container.appendChild(col);
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
