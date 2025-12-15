import { getAccessToken, clearSession } from "./session.js";

export const API_BASE_URL = 'http://localhost:8000/api';

async function rawRequest(
    path,
    { method = 'GET', body, headers = {}, auth = false } = {}
) {
    const url = `${API_BASE_URL}${path}`;
    const finalHeaders = { ...headers };

    if (
        !(body instanceof FormData) &&
        body !== undefined &&
        !finalHeaders['Content-Type']
    ) {
        finalHeaders['Content-Type'] = 'application/json';
    }

    if (auth) {
        const token = getAccessToken();
        if (token) {
            finalHeaders['Authorization'] = `Bearer ${token}`;
        }
    }

    const response = await fetch(url, {
        method,
        headers: finalHeaders,
        body:
            body instanceof FormData
                ? body
                : body !== undefined
                ? JSON.stringify(body)
                : undefined,
    });

    if (response.status === 401 && auth) {
        clearSession();
    }

    if (!response.ok) {
        let message = `Ошибка ${response.status}`;
        try {
            const data = await response.json();
            if (data?.message) message = data.message;
        } catch {}

        const error = new Error(message);
        error.status = response.status;
        throw error;
    }

    if (response.status === 204) return null;

    const text = await response.text();
    if (!text) return null;

    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}

export function apiGet(path, { auth = false, headers } = {}) {
    return rawRequest(path, { method: 'GET', auth, headers });
}

export function apiPost(path, body, { auth = false, headers } = {}) {
    return rawRequest(path, { method: 'POST', body, auth, headers });
}

export function apiPut(path, body, { auth = false, headers } = {}) {
    return rawRequest(path, { method: 'PUT', body, auth, headers });
}

export function apiPatch(path, body, { auth = false, headers } = {}) {
    return rawRequest(path, { method: 'PATCH', body, auth, headers });
}

export function apiDelete(path, { auth = false, headers } = {}) {
    return rawRequest(path, { method: 'DELETE', auth, headers });
}