export function formatDateTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleString("ru-RU");
}

export function parseDate(d) {
  const t = Date.parse(d);
  return Number.isNaN(t) ? 0 : t;
}
