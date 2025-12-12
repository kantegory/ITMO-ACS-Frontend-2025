const ACCESS_TOKEN_KEY = 'accessToken';
const USER_KEY = 'currentUser';

export function saveSession(tokens = {}, user) {
    const accessToken = tokens.token || tokens.accessToken;

    if (accessToken) {
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    }

    if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
}

export function clearSession() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

export function getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getCurrentUser() {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) {
        return null;
    }

    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export function isLoggedIn() {
    return Boolean(getAccessToken());
}

export function updateStoredUser(partial) {
    const current = getCurrentUser() || {};
    const updated = { ...current, ...partial };
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
    return updated;
}