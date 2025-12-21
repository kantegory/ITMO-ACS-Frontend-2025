import { getAccessToken, getTokenType } from "./auth.storage.js";

export async function authFetch(url, options = {}) {
  const headers = { ...(options.headers || {}) };

  const token = getAccessToken();
  if (token) {
    headers["Authorization"] = `${getTokenType()} ${token}`;
  }

  return fetch(url, { ...options, headers });
}
