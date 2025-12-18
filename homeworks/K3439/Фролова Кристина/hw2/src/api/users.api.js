import { API_BASE } from "../config.js";
import { authFetch } from "../../js/auth.js";

export async function getMe() {
  const res = await authFetch(`${API_BASE}/users/me`);
  if (res.status === 401) throw new Error("Unauthorized: please login");
  if (!res.ok) throw new Error(`Me load failed: ${res.status}`);
  return res.json();
}

const usersCache = new Map();

export async function getUserById(userId) {
  if (!userId) return null;
  if (usersCache.has(userId)) return usersCache.get(userId);

  const res = await authFetch(`${API_BASE}/users/${encodeURIComponent(userId)}`);
  if (!res.ok) {
    usersCache.set(userId, null);
    return null;
  }

  const user = await res.json();
  usersCache.set(userId, user);
  return user;
}

