import { API_BASE } from "./config.js";
import { authFetch } from "./auth.js";

let currentAdvertId = null;
let currentOwnerId = null;
let currentMeId = null;

function getIdFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function formatPrice(value) {
  if (value == null) return "";
  return `${Number(value).toLocaleString("ru-RU")} ₽/мес.`;
}

function livingTypeToText(type) {
  switch (type) {
    case "FLAT":
      return "Квартира";
    case "ROOM":
      return "Комната";
    case "COUNTRY_HOUSE":
      return "Дом";
    default:
      return "Жильё";
  }
}

function renderPhotos(photos) {
  const inner = document.getElementById("photosCarouselInner");
  if (!inner) return;

  inner.innerHTML = "";

  photos.forEach((photo, index) => {
    const item = document.createElement("div");
    item.className = "carousel-item" + (index === 0 ? " active" : "");
    const src = photo.path || photo.url || "https://picsum.photos/800/450";

    item.innerHTML = `
  <img src="${src}"
       class="d-block w-100 carousel-img"
       alt="Фото ${index + 1}">
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

function renderParams(advert) {
  const list = document.getElementById("advertParams");
  if (!list) return;

  const living = advert.property?.living;
  const property = advert.property;

  const items = [];

  if (living) {
    items.push(`Тип объекта: ${livingTypeToText(living.livingType)}`);

    if (living.totalRooms != null) {
      items.push(`Комнат: ${living.totalRooms}`);
    }

    if (living.area != null) {
      items.push(`Площадь: ${living.area} м²`);
    }

    if (living.flat?.floor != null && living.totalFloors != null) {
      items.push(`Этаж: ${living.flat.floor} из ${living.totalFloors}`);
    }

    if (living.flat?.kitchenArea != null) {
      items.push(`Площадь кухни: ${living.flat.kitchenArea} м²`);
    }

    if (living.comfort?.renovation) {
      items.push(`Ремонт: ${living.comfort.renovation}`);
    }
    if (living.comfort?.internet) {
      items.push("Интернет: есть");
    }
    if (living.comfort?.tv) {
      items.push("Телевизор: есть");
    }
    if (living.comfort?.furniture) {
      items.push(`Мебель: ${living.comfort.furniture}`);
    }
    if (living.comfort?.devices) {
      items.push(`Техника: ${living.comfort.devices}`);
    }
  }

  if (property?.totalArea != null) {
    items.push(`Общая площадь: ${property.totalArea} м²`);
  }

  if (items.length === 0) {
    list.innerHTML = "<li>Параметры не указаны</li>";
    return;
  }

  list.innerHTML = items.map(i => `<li>${i}</li>`).join("");
}

async function loadAdvert() {
  const id = getIdFromQuery();
  currentAdvertId = id;
  const titleEl = document.getElementById("advertTitle");
  const locEl = document.getElementById("advertLocation");
  const priceEl = document.getElementById("advertPrice");
  const descEl = document.getElementById("advertDescription");
  const pageTitle = document.getElementById("pageTitle");

  if (!id) {
    if (titleEl) titleEl.textContent = "Объявление не найдено";
    if (descEl) descEl.textContent = "Не передан параметр id в адресной строке.";
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/advertisements/${id}`);

    if (!response.ok) {
      throw new Error(`Ошибка загрузки: ${response.status}`);
    }

    const advert = await response.json();
    const ownerId = advert.property?.ownerId;
    await loadOwner(ownerId);
    currentOwnerId = ownerId;

    const living = advert.property?.living;
    const typeText = livingTypeToText(living?.livingType);
    const areaText = living?.area ? `${living.area} м²` : "";
    const title = advert.title || "Объявление";

    const titleFull =
      areaText && typeText !== "Жильё"
        ? `${typeText} ${areaText}`
        : title;

    if (titleEl) titleEl.textContent = titleFull;
    if (pageTitle) pageTitle.textContent = `${titleFull} — Площадь.ру`;

    const locationText = advert.property?.location || "";
    if (locEl) locEl.textContent = locationText;
    if (priceEl) priceEl.textContent = formatPrice(advert.pricePerPeriod);
    if (descEl) {
      descEl.textContent = advert.description || "Описание не указано.";
    }

    const photos = advert.property?.photos?.map(photo => ({
      path: photo.path
    })) ?? [];
    renderPhotos(photos);

    renderConditions(advert);
    renderParams(advert);
  } catch (e) {
    console.error(e);
    if (titleEl) titleEl.textContent = "Ошибка загрузки объявления";
    if (descEl) {
      descEl.textContent =
        "Не удалось загрузить данные. Попробуйте обновить страницу позже.";
    }
  }
}

async function loadOwner(ownerId) {
  const nameEl = document.getElementById("ownerName");
  const metaEl = document.getElementById("ownerMeta");
  const phoneEl = document.getElementById("ownerPhone");

  if (!ownerId) {
    if (nameEl) nameEl.textContent = "Владелец не указан";
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/users/${ownerId}`);

    if (!response.ok) {
      throw new Error(`Owner load failed: ${response.status}`);
    }

    const owner = await response.json();

    const fullName = [owner.firstName, owner.lastName].filter(Boolean).join(" ").trim();
    if (nameEl) nameEl.textContent = fullName || "Владелец";

    if (metaEl) {
      if (owner.createdAt) {
        const year = new Date(owner.createdAt).getFullYear();
        metaEl.textContent = `На площадке с ${year} года`;
      } else {
        metaEl.textContent = "";
      }
    }

    if (phoneEl) {
      phoneEl.textContent = owner.phone ? `Телефон: ${owner.phone}` : "";
    }
  } catch (e) {
    console.error(e);
    if (nameEl) nameEl.textContent = "Не удалось загрузить владельца";
    if (metaEl) metaEl.textContent = "";
    if (phoneEl) phoneEl.textContent = "";
  }
}

async function loadMeId() {
  const res = await authFetch(`${API_BASE}/users/me`);
  if (!res.ok) return null;
  const me = await res.json();
  return me?.id ?? null;
}

async function sendMessage({ receiverId, senderId, advertisementId, text }) {
  const res = await authFetch(`${API_BASE}/messages`, {
    method: "POST",
    body: JSON.stringify({ receiverId, senderId, advertisementId, text }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(`Send failed: ${res.status} ${err}`);
  }
}

function setupContactSendHandler() {
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest("#contactSendButton");
    if (!btn) return;

    const input = document.getElementById("contactMessage");
    const text = (input?.value || "").trim();
    if (!text) return;

    if (!currentMeId) {
      window.location.href = "login.html";
      return;
    }
    if (!currentAdvertId || !currentOwnerId) {
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
      input.value = "";
    } catch (err) {
      console.error(err);
      alert("Не удалось отправить сообщение владельцу");
    } finally {
      btn.disabled = false;
    }
  });
}


document.addEventListener("DOMContentLoaded", async () => {
  setupContactSendHandler();

  currentMeId = await loadMeId().catch(() => null);

  await loadAdvert();
});
