import { STORAGE_USER_KEY } from './constants.js';

export function loadUserFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_USER_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (error) {
        console.error('Не удалось прочитать данные пользователя', error);
        return null;
    }
}

export function sanitizeUser(user) {
    if (!user) {
        return null;
    }
    const clone = { ...user };
    delete clone.password;
    return clone;
}

export function persistUser(user) {
    const safeUser = sanitizeUser(user);
    state.currentUser = safeUser;

    if (safeUser) {
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(safeUser));
    } else {
        localStorage.removeItem(STORAGE_USER_KEY);
    }
}

export const state = {
    workouts: [],
    blogPosts: [],
    currentUser: loadUserFromStorage()
};
