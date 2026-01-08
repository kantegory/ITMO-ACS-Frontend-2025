import {API_BASE} from "../src/config.js";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const TOKEN_TYPE_KEY = "tokenType";

export function saveTokens(loginResponse) {
  if (!loginResponse?.accessToken) {
    throw new Error("No accessToken in login response");
  }

  localStorage.setItem(TOKEN_TYPE_KEY, loginResponse.type || "Bearer");
  localStorage.setItem(ACCESS_TOKEN_KEY, loginResponse.accessToken);

  if (loginResponse.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, loginResponse.refreshToken);
  }
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_TYPE_KEY);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function isAuthenticated() {
  return Boolean(getAccessToken());
}

export async function authFetch(url, options = {}) {
  const token = getAccessToken();
  const type = localStorage.getItem(TOKEN_TYPE_KEY) || "Bearer";

  const headers = {
    ...(options.headers || {}),
  };

  if (options.body !== undefined && options.body !== null) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `${type} ${token}`;
  }

  return await fetch(url, {
    ...options,
    headers,
  });
}

export const AUTH_API = {
  register: `${API_BASE}/auth/register`,
  login: `${API_BASE}/auth/login`,
};
