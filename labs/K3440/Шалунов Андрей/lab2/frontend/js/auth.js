import { apiPost, apiGet } from './api.js';
import { saveSession, clearSession, getCurrentUser } from './session.js';

export async function registerUser({ name, email, password, phone }) {
    const payload = { name, email, password, phone };
    return apiPost('/auth/register', payload);
}

export async function loginUser({ email, password }) {
    const data = await apiPost('/auth/login', { email, password });

    const tokens = { token: data.token };
    saveSession(tokens);

    try {
        const me = await apiGet('/users/me', { auth: true });
        if (me) {
            saveSession(tokens, {
                user_id: me.user_id,
                name: me.name,
                email: me.email,
                phone: me.phone ?? null,
            });
            return { token: data.token, user: me };
        }
    } catch (error) {
        console.warn('Failed to fetch user info after login:', error);
    }

    return { token: data.token, user: null };
}

export function logout() {
    clearSession();
}

export function getLoggedInUser() {
    return getCurrentUser();
}