import { request } from '../core/http.js';
import { authSession } from './auth.session.js';

export async function login(email, password) {
    const data = await request('/auth/login', 'POST', { email, password });
    authSession.setSession(data);
    return data.user;
}

export async function register(email, password, username) {
    const data = await request('/auth/register', 'POST', {
        email,
        password,
        username
    });
    authSession.setSession(data);
    return data.user;
}

export async function logout() {
    try {
        await request('/auth/logout', 'POST');
    } finally {
        authSession.clear();
        window.location.href = 'login.html';
    }
}