import { API_BASE } from "../config.js";
import { authFetch } from "../../js/auth.js";

export async function getMyMessages() {
  const res = await authFetch(`${API_BASE}/messages/me`);
  if (!res.ok) throw new Error(`My messages load failed: ${res.status}`);
  const body = await res.json();
  return Array.isArray(body) ? body : body.content ?? [];
}

export async function getMeId() {
  const res = await authFetch(`${API_BASE}/users/me`);
  if (!res.ok) return null;
  const me = await res.json();
  return me?.id ?? null;
}

export async function sendMessage({ receiverId, senderId, advertisementId, text }) {
  const res = await authFetch(`${API_BASE}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ receiverId, senderId, advertisementId, text }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Send failed: ${res.status} ${errText}`);
  }

  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : null;
}
