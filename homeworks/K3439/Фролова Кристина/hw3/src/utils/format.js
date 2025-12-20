export function formatPrice(value) {
  if (value == null) return "";
  return `${Number(value).toLocaleString("ru-RU")} ₽/мес.`;
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
