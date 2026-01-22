export const AUTH_USER_KEY = "user";

export function getCurrentUserFromStorage() {
    try {
        const s = localStorage.getItem(AUTH_USER_KEY);
        return s ? JSON.parse(s) : null;
    } catch (error) {
        console.error('Error parsing user from storage:', error);
        return null;
    }
}

export function setCurrentUser(user) {
    try {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } catch (error) {
        console.error('Error saving user to storage:', error);
    }
}

export function getToken() {
    return localStorage.getItem('token');
}

export function setToken(token) {
    localStorage.setItem('token', token);
}

export function removeToken() {
    localStorage.removeItem('token');
}

export function isAuthenticated() {
    return !!getToken() && !!getCurrentUserFromStorage();
}

export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem(AUTH_USER_KEY);
    window.location.href = '../index.html';
}

export const authManager = {
    isAuthenticated: () => isAuthenticated(),
    getCurrentUser: () => getCurrentUserFromStorage(),
    setCurrentUser: (user) => setCurrentUser(user),
    logout: () => logout(),
    getToken: () => getToken()
};

if (typeof window !== 'undefined') {
    window.authManager = authManager;
}