import { apiGet, apiPatch } from './api.js';
import { updateStoredUser, getCurrentUser } from './session.js';

export async function fetchMyProfile() {
    const data = await apiGet('/users/me', { auth: true });

    updateStoredUser({
        user_id: data.user_id,
        name: data.name,
        email: data.email,
        phone: data.phone ?? null
    });

    return data;
}

export async function updateMyProfile(payload) {
    const current = getCurrentUser();
    if (!current || !current.user_id)  {
        throw new Error('Неизвестен ID текущего пользователя');
    }

    const id = current.user_id;
    const data = await apiPatch(`/users/${id}`, payload, { auth: true });

    updateStoredUser({
        user_id: data.user_id,
        name: data.name,
        email: data.email,
        phone: data.phone ?? null
    });

    return data;
}