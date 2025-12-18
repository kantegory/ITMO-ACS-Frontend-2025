const resultsContainerId = "results";

export function renderCards(cards) {
  const container = document.getElementById(resultsContainerId);
  if (!container) return;

  container.innerHTML = "";

  if (!cards || cards.length === 0) {
    container.innerHTML = '<p class="text-muted">Объявлений не найдено.</p>';
    return;
  }

  cards.forEach((card) => {
    const article = document.createElement("article");
    article.className = "col-md-4 property-card";
    article.setAttribute("aria-labelledby", `property-title-${card.id}`);
    article.setAttribute("aria-describedby", `property-meta-${card.id}`);

    const img = card.image || "https://picsum.photos/400/250";
    const title = escapeHtml(card.title || "Без названия");
    const priceText = escapeHtml(card.priceText || "");
    const address = escapeHtml(card.location || "");
    const description = escapeHtml(card.description || "");

    article.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img
          src="${img}"
          class="card-img-top"
          alt="Фото объекта: ${title}"
          loading="lazy"
        >

        <div class="card-body d-flex flex-column">
          <h2 class="h5 card-title" id="property-title-${card.id}">
            ${title}
          </h2>

          <div id="property-meta-${card.id}">
            <p class="card-text mb-1">${address}</p>
            <p class="card-text fw-bold mb-2">${priceText}</p>
            ${description ? `<p class="card-text small text-muted">${description}</p>` : ""}
          </div>

          <div class="mt-auto">
            <a
              href="advertisement-details.html?id=${encodeURIComponent(card.id)}"
              class="btn btn-outline-primary btn-sm"
              aria-label="Открыть объявление: ${title}">
              Подробнее
            </a>
          </div>
        </div>
      </div>
    `;

    container.appendChild(article);
  });
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
