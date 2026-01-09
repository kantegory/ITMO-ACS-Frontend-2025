import { storage } from './storage.js';

export const API_BASE = window.API_BASE || 'http://localhost:4000';

async function parseError(res) {
    const text = await res.text();
    try {
        return JSON.parse(text);
    } catch {
        return { message: text || `HTTP ${res.status}` };
    }
}

export async function request(path, method = 'GET', body, options = {}) {
    const headers = options.headers ? { ...options.headers } : {};
    const token = storage.getToken();

    if (!(body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(API_BASE + path, {
        method,
        headers,
        body: body
            ? body instanceof FormData
                ? body
                : JSON.stringify(body)
            : undefined
    });

    if (!res.ok) {
        if (res.status === 401) {
            storage.clearAuth();
        }
        const err = await parseError(res);
        throw new Error(err.message);
    }

    if (res.status === 204) return null;
    return res.headers.get('Content-Type')?.includes('application/json')
        ? res.json()
        : res.text();
}