export function renderPhotos(photos) {
  const inner = document.getElementById("photosCarouselInner");
  if (!inner) return;

  inner.innerHTML = "";

  (photos || []).forEach((photo, index) => {
    const item = document.createElement("div");
    item.className = "carousel-item" + (index === 0 ? " active" : "");
    const src = photo?.path || photo?.url || "https://picsum.photos/800/450";

    item.innerHTML = `
      <img src="${src}"
           class="d-block w-100 carousel-img"
           alt="Фото ${index + 1}">
    `;
    inner.appendChild(item);
  });
}
