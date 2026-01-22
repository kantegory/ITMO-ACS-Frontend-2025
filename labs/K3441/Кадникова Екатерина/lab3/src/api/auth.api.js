import { api } from './http';
import { useAuth } from '@/composables/useAuth';

export async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    const auth = useAuth();
    auth.setSession(data);
    return data.user;
}

export async function register(email, password, username) {
    const { data } = await api.post('/auth/register', {
        email,
        password,
        username
    });
    const auth = useAuth();
    auth.setSession(data);
    return data.user;
}

export async function logout() {
    const auth = useAuth();
    try {
        await api.post('/auth/logout');
    } finally {
        auth.logout();
    }
}