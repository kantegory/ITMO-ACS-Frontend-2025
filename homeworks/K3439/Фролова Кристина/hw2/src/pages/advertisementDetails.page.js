import { API_BASE } from "../config.js";
import { authFetch } from "../api/http.js";
import { getQueryParam } from "../utils/query.js";
import { formatPrice, livingTypeToText, setText } from "../utils/format.js";

let currentAdvertId = null;
let currentOwnerId = null;
let currentMeId = null;

export function initAdvertisementDetailsPage() {
  setupContactSendHandler();

  (async () => {
    currentMeId = await loadMeId().catch(() => null);
    await loadAdvert();
  })();
}

async function loadMeId() {
  const res = await authFetch(`${API_BASE}/users/me`);
  if (!res.ok) throw new Error(`Me load failed: ${res.status}`);
  const me = await res.json();
  return me?.id ?? null;
}

async function loadAdvert() {
  const id = getQueryParam("id");
  if (!id) return;

  currentAdvertId = id;

  const res = await authFetch(`${API_BASE}/advertisements/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`Advert load failed: ${res.status}`);

  const advert = await res.json();

  currentOwnerId = advert?.ownerId ?? advert?.owner?.id ?? null;

  renderAdvert(advert);

  if (currentOwnerId) {
    await loadOwner(currentOwnerId).catch(() => {});
  }
}

function renderAdvert(advert) {
  setText("title", advert?.title);
  setText("price", advert?.price != null ? formatPrice(advert.price) : "—");
  setText("livingType", livingTypeToText(advert?.livingType));

  renderPhotos(advert?.photos || advert?.images || []);
  renderConditions(advert);
}

function renderPhotos(photos) {
  const inner = document.getElementById("photosCarouselInner");
  if (!inner) return;

  inner.innerHTML = "";

  const list = Array.isArray(photos) ? photos : [];
  if (list.length === 0) {
    const item = document.createElement("div");
    item.className = "carousel-item active";
    item.innerHTML = `
      <img src="https://picsum.photos/800/450"
           class="d-block w-100 carousel-img"
           alt="Фото">
    `;
    inner.appendChild(item);
    return;
  }

  list.forEach((photo, index) => {
    const item = document.createElement("div");
    item.className = "carousel-item" + (index === 0 ? " active" : "");
    const src = photo.path || photo.url || "https://picsum.photos/800/450";

    item.innerHTML = `
      <img src="${src}" class="d-block w-100 carousel-img" alt="Фото ${index + 1}">
    `;
    inner.appendChild(item);
  });
}

function renderConditions(advert) {
  const list = document.getElementById("rentConditions");
  if (!list) return;

  list.innerHTML = "";

  const items = [];

  if (advert.deposit != null) {
    items.push(`Залог: ${advert.deposit.toLocaleString("ru-RU")} ₽`);
  }

  if (advert.rentType) {
    let rentText = "";
    switch (advert.rentType) {
      case "DAY":
        rentText = "Помесячная аренда с посуточной оплатой";
        break;
      default:
        rentText = `Тип аренды: ${advert.rentType}`;
    }
    items.push(rentText);
  }

  if (advert.rules) {
    const r = advert.rules;
    if (r.guestCount != null) {
      items.push(`Макс. гостей: ${r.guestCount}`);
    }
    items.push(
      `С детьми: ${r.withChildren ? "можно" : "нельзя"}`,
      `С животными: ${r.withAnimals ? "можно" : "нельзя"}`,
      `Курить: ${r.allowedSmoking ? "можно" : "нельзя"}`,
      `Вечеринки: ${r.allowedParties ? "можно" : "нельзя"}`,
      `Отчётные документы: ${r.reportDocs ? "предоставляются" : "не предоставляются"}`
    );
  }

  if (items.length === 0) {
    list.innerHTML = "<li>Условия аренды не указаны</li>";
    return;
  }

  list.innerHTML = items.map(i => `<li>${i}</li>`).join("");
}

async function loadOwner(ownerId) {
  const res = await authFetch(`${API_BASE}/users/${encodeURIComponent(ownerId)}`);
  if (!res.ok) return null;

  const owner = await res.json();
  setText("ownerName", `${owner?.firstName ?? ""} ${owner?.lastName ?? ""}`.trim() || "—");
  setText("ownerEmail", owner?.email ?? "—");
  return owner;
}

async function sendMessage(payload) {
  const res = await authFetch(`${API_BASE}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || `Send message failed: ${res.status}`);
  }
}

function setupContactSendHandler() {
  const btn = document.getElementById("sendContactMessageBtn");
  const textarea = document.getElementById("contactMessageText");
  if (!btn || !textarea) return;

  btn.addEventListener("click", async () => {
    const text = textarea.value.trim();
    if (!text) return;

    if (!currentOwnerId) {
      alert("Не удалось определить получателя. Обнови страницу.");
      return;
    }

    btn.disabled = true;
    try {
      await sendMessage({
        receiverId: currentOwnerId,
        senderId: currentMeId,
        advertisementId: Number(currentAdvertId),
        text,
      });

      const modalEl = document.getElementById("contactModal");
      const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
      modal.hide();
      textarea.value = "";
    } finally {
      btn.disabled = false;
    }
  });
}
