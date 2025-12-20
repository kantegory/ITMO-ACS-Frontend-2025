import { formatPrice, livingTypeToText } from "../utils/format.js";
import { renderPhotos } from "./carousel.ui.js";

export function renderAdvert(advert) {
  const titleEl = document.getElementById("advertTitle");
  const locEl = document.getElementById("advertLocation");
  const priceEl = document.getElementById("advertPrice");
  const descEl = document.getElementById("advertDescription");
  const pageTitle = document.getElementById("pageTitle");

  const living = advert.property?.living;
  const typeText = livingTypeToText(living?.livingType);
  const areaText = living?.area ? `${living.area} м²` : "";
  const title = advert.title || "Объявление";

  const titleFull = areaText && typeText !== "Жильё" ? `${typeText} ${areaText}` : title;

  if (titleEl) titleEl.textContent = titleFull;
  if (pageTitle) pageTitle.textContent = `${titleFull} — Площадь.ру`;

  if (locEl) locEl.textContent = advert.property?.location || "";
  if (priceEl) priceEl.textContent = formatPrice(advert.pricePerPeriod);
  if (descEl) descEl.textContent = advert.description || "Описание не указано.";

  const photos = advert.property?.photos?.map(p => ({ path: p.path })) ?? [];
  renderPhotos(photos);

  renderConditions(advert);
  renderParams(advert);
}

export function renderAdvertError(message) {
  const titleEl = document.getElementById("advertTitle");
  const descEl = document.getElementById("advertDescription");
  if (titleEl) titleEl.textContent = "Ошибка загрузки объявления";
  if (descEl) descEl.textContent = message;
}

export function renderNoId() {
  const titleEl = document.getElementById("advertTitle");
  const descEl = document.getElementById("advertDescription");
  if (titleEl) titleEl.textContent = "Объявление не найдено";
  if (descEl) descEl.textContent = "Не передан параметр id в адресной строке.";
}

export function renderOwner(owner) {
  const nameEl = document.getElementById("ownerName");
  const metaEl = document.getElementById("ownerMeta");
  const phoneEl = document.getElementById("ownerPhone");

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

  if (phoneEl) phoneEl.textContent = owner.phone ? `Телефон: ${owner.phone}` : "";
}

export function renderOwnerMissing() {
  const nameEl = document.getElementById("ownerName");
  if (nameEl) nameEl.textContent = "Владелец не указан";
}

export function renderOwnerError() {
  const nameEl = document.getElementById("ownerName");
  const metaEl = document.getElementById("ownerMeta");
  const phoneEl = document.getElementById("ownerPhone");
  if (nameEl) nameEl.textContent = "Не удалось загрузить владельца";
  if (metaEl) metaEl.textContent = "";
  if (phoneEl) phoneEl.textContent = "";
}

function renderConditions(advert) {
  const list = document.getElementById("rentConditions");
  if (!list) return;

  list.innerHTML = "";
  const items = [];

  if (advert.deposit != null) items.push(`Залог: ${advert.deposit.toLocaleString("ru-RU")} ₽`);

  if (advert.rentType) {
    items.push(advert.rentType === "DAY"
      ? "Помесячная аренда с посуточной оплатой"
      : `Тип аренды: ${advert.rentType}`
    );
  }

  if (advert.rules) {
    const r = advert.rules;
    if (r.guestCount != null) items.push(`Макс. гостей: ${r.guestCount}`);
    items.push(
      `С детьми: ${r.withChildren ? "можно" : "нельзя"}`,
      `С животными: ${r.withAnimals ? "можно" : "нельзя"}`,
      `Курить: ${r.allowedSmoking ? "можно" : "нельзя"}`,
      `Вечеринки: ${r.allowedParties ? "можно" : "нельзя"}`,
      `Отчётные документы: ${r.reportDocs ? "предоставляются" : "не предоставляются"}`
    );
  }

  list.innerHTML = items.length ? items.map(i => `<li>${i}</li>`).join("") : "<li>Условия аренды не указаны</li>";
}

function renderParams(advert) {
  const list = document.getElementById("advertParams");
  if (!list) return;

  const living = advert.property?.living;
  const property = advert.property;
  const items = [];

  if (living) {
    items.push(`Тип объекта: ${livingTypeToText(living.livingType)}`);
    if (living.totalRooms != null) items.push(`Комнат: ${living.totalRooms}`);
    if (living.area != null) items.push(`Площадь: ${living.area} м²`);
    if (living.flat?.floor != null && living.totalFloors != null) items.push(`Этаж: ${living.flat.floor} из ${living.totalFloors}`);
    if (living.flat?.kitchenArea != null) items.push(`Площадь кухни: ${living.flat.kitchenArea} м²`);
    if (living.comfort?.renovation) items.push(`Ремонт: ${living.comfort.renovation}`);
    if (living.comfort?.internet) items.push("Интернет: есть");
    if (living.comfort?.tv) items.push("Телевизор: есть");
    if (living.comfort?.furniture) items.push(`Мебель: ${living.comfort.furniture}`);
    if (living.comfort?.devices) items.push(`Техника: ${living.comfort.devices}`);
  }

  if (property?.totalArea != null) items.push(`Общая площадь: ${property.totalArea} м²`);

  list.innerHTML = items.length ? items.map(i => `<li>${i}</li>`).join("") : "<li>Параметры не указаны</li>";
}
