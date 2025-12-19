import { request } from '../core/http.js';
import { authSession } from '../auth/auth.session.js';

export async function getMe() {
    const user = authSession.getUser();
    if (!user?.id) return null;

    try {
        const data = await request(`/users/${user.id}`);
        return data || null;
    } catch (err) {
        console.warn('getMe failed:', err.message);
        return user;
    }
}

export async function updateUser(id, data) {
    const updated = await request(`/users/${id}`, 'PUT', data);

    const current = authSession.getUser();
    if (current?.id === id) {
        authSession.setSession({ user: { ...current, ...updated } });
    }

    return updated;
}