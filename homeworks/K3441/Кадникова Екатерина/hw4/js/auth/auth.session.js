import { storage } from '../core/storage.js';

export const authSession = {
    isAuthenticated() {
        return !!storage.getToken() && !!storage.getUser();
    },

    getUser() {
        return storage.getUser();
    },

    setSession({ token, user }) {
        if (token) storage.setToken(token);
        if (user) storage.setUser(user);
    },

    clear() {
        storage.clearAuth();
    }
};