import axios from 'axios';
import { useAuth } from '@/composables/useAuth';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(config => {
    const { token } = useAuth();
    if (token.value) {
        config.headers.Authorization = `Bearer ${token.value}`;
    }
    return config;
});

api.interceptors.response.use(
    res => res,
    err => {
        if (err.response?.status === 401) {
            const { logout } = useAuth();
            logout();
        }
        return Promise.reject(err.response?.data || err);
    }
);