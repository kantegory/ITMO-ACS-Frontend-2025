export const AUTH_USER_KEY = "user";
export function getCurrentUserFromStorage() {
    const s = localStorage.getItem(AUTH_USER_KEY);
    return s ? JSON.parse(s) : null;
}

export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem(AUTH_USER_KEY);
    window.location.href = 'index.html';
}

export function isAuthenticated() {
    return !!localStorage.getItem('token') && !!getCurrentUserFromStorage();
}