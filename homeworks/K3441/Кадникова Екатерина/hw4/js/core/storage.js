const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const storage = {
    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },

    setToken(token) {
        localStorage.setItem(TOKEN_KEY, token);
    },

    removeToken() {
        localStorage.removeItem(TOKEN_KEY);
    },

    getUser() {
        try {
            const s = localStorage.getItem(USER_KEY);
            return s ? JSON.parse(s) : null;
        } catch {
            return null;
        }
    },

    setUser(user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },

    removeUser() {
        localStorage.removeItem(USER_KEY);
    },

    clearAuth() {
        this.removeToken();
        this.removeUser();
    }
};