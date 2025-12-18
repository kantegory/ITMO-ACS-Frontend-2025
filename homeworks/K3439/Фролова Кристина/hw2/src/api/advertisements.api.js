import { API_BASE } from "../config.js";
import { authFetch } from "../../js/auth.js";

export async function getMyAdvertisements() {
  const res = await authFetch(`${API_BASE}/advertisements/me`);
  if (!res.ok) throw new Error(`My adverts load failed: ${res.status}`);
  const body = await res.json();
  return Array.isArray(body) ? body : body.content ?? [];
}

const advertsCache = new Map();

export async function getAdvertisementById(advertId) {
  if (advertId == null) return null;
  const key = String(advertId);
  if (advertsCache.has(key)) return advertsCache.get(key);

  const res = await authFetch(`${API_BASE}/advertisements/${encodeURIComponent(advertId)}`);
  if (!res.ok) {
    advertsCache.set(key, null);
    return null;
  }

  const advert = await res.json();
  advertsCache.set(key, advert);
  return advert;
}

export async function getAdvertTitle(advertId) {
  const advert = await getAdvertisementById(advertId);
  return advert?.title || `Объявление #${advertId}`;
}

export function mapLivingType(uiValue) {
  switch (uiValue) {
    case "flat": return "FLAT";
    case "room": return "ROOM";
    case "country-house": return "COUNTRY_HOUSE";
    default: return "";
  }
}

export function buildSearchUrl({ location, typeUi, minPrice, maxPrice }) {
  const params = new URLSearchParams();

  if (location) params.set("location", location);

  const livingType = mapLivingType(typeUi);
  if (livingType) params.set("living_type", livingType);

  if (minPrice) params.set("min_price", String(Number(minPrice)));
  if (maxPrice) params.set("max_price", String(Number(maxPrice)));

  const qs = params.toString();
  return qs ? `${API_BASE}/advertisements?${qs}` : `${API_BASE}/advertisements`;
}

export async function fetchAdvertisements(filters) {
  const url = buildSearchUrl(filters);
  const res = await fetch(url);

  if (!res.ok) throw new Error(`Ошибка загрузки: ${res.status}`);

  const body = await res.json();
  return Array.isArray(body) ? body : body.content ?? [];
}
