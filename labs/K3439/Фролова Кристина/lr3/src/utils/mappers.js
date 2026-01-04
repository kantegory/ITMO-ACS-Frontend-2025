import { formatDateTime } from "@/utils/datetime";

export function getFirstImage(advertisement) {
  const path = advertisement?.property?.photos?.[0]?.path;
  if (!path) return null;
  return path;
}

export function livingTypeToText(type) {
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

export function advertisementToCard(ad) {
  const livingType = ad?.property?.living?.livingType;
  const typeText = livingTypeToText(livingType);

  const rooms = ad?.property?.living?.totalRooms;
  const area = ad?.property?.totalArea;

  const descParts = [];
  if (typeText) descParts.push(typeText);
  if (rooms != null && rooms !== 0) descParts.push(`${rooms} комн.`);
  if (area != null && area !== 0) descParts.push(`${area} м²`);

  return {
    id: ad.id,
    title: ad.title || "Без названия",
    priceText: formatPricePerPeriod(ad.pricePerPeriod, ad.rentType),
    location: ad?.property?.location || "",
    description: ad.description || descParts.join(", "),
    image: ad?.property?.photos?.[0]?.path || null,
  };
}


export function formatPricePerPeriod(value, rentType) {
  if (value == null) return "";
  const unit = rentType === "DAY" ? "₽/день" : "₽/мес.";
  return `${Number(value).toLocaleString("ru-RU")} ${unit}`;
}

export function statusClassFromStatus(status) {
  if (status === "ACTIVE" || status === "APPROVED") return "text-success";
  if (status === "PENDING") return "text-warning";
  if (status === "REJECTED" || status === "CANCELED" || status === "BLOCKED") return "text-danger";
  return "text-muted";
}

export function mapAdvertisementToItem(a) {
  const price = a?.pricePerPeriod != null ? `${Number(a.pricePerPeriod).toLocaleString("ru-RU")} ₽` : "—";
  const rentType = a?.rentType ? ` · ${a.rentType}` : "";
  const address = a?.property?.location ?? "—";

  return {
    id: a.id,
    advertisementId: a.id,
    title: a?.title ?? "Без названия",
    address,
    details: `${price}${rentType}`,
    statusText: a?.status ?? "—",
    statusClass: statusClassFromStatus(a?.status),
  };
}

export function mapRentalToItem(r, advertisementTitle = null) {
  const details = [
    r?.totalPrice != null ? `${Number(r.totalPrice).toLocaleString("ru-RU")} ₽` : null,
    r?.startDate ? formatDateTime(r.startDate) : null,
    r?.endDate ? `— ${formatDateTime(r.endDate)}` : null,
  ].filter(Boolean).join(" ");

  return {
    id: r.id,
    advertisementId: r?.advertisementId ?? null,
    title: advertisementTitle ?? "Аренда",
    details: details || "—",
    statusText: r?.status ?? "—",
    statusClass: statusClassFromStatus(r?.status),
  };
}

