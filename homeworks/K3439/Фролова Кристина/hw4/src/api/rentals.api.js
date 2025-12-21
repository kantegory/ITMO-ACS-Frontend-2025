import { API_BASE } from "../config.js";
import { authFetch } from "../../js/auth.js";

export async function getMyRentals() {
  const res = await authFetch(`${API_BASE}/rentals/me`);
  if (!res.ok) throw new Error(`My rentals load failed: ${res.status}`);
  const body = await res.json();
  return Array.isArray(body) ? body : body.content ?? [];
}
