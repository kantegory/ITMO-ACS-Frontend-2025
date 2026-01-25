import { api } from './http';
import { useAuth } from '@/composables/useAuth';

export async function getMe() {
    const { user } = useAuth();
    if (!user.value?.id) return null;

    try {
        const { data } = await api.get(`/users/${user.value.id}`);
        return data;
    } catch {
        return user.value;
    }
}

export async function updateUser(id, payload) {
    const { data } = await api.put(`/users/${id}`, payload);

    const auth = useAuth();
    if (auth.user.value?.id === id) {
        auth.setSession({ user: { ...auth.user.value, ...data } });
    }

    return data;
}