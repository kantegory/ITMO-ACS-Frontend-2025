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
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(TOKEN_TYPE_KEY);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getTokenType() {
  return localStorage.getItem(TOKEN_TYPE_KEY) || "Bearer";
}

export function isAuthenticated() {
  return Boolean(getAccessToken());
}
