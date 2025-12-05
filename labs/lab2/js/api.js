export const API_BASE = window.API_BASE || "http://localhost:4000";

export function getToken() {
    return localStorage.getItem('token');
}

async function parseErrorBody(res) {
    try {
        const txt = await res.text();
        try { return JSON.parse(txt); } catch (e) { return txt; }
    } catch (e) {
        return null;
    }
}

export async function request(path, method = "GET", body = null, opts = {}) {
    const token = getToken();
    const headers = opts.headers ? {...opts.headers} : {};
    if (!(body instanceof FormData)) headers["Content-Type"] = "application/json";
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(API_BASE + path, {
        method,
        headers,
        body: body instanceof FormData ? body : (body ? JSON.stringify(body) : null),
    });

    if (!response.ok) {
        const parsed = await parseErrorBody(response);
        const msg = parsed && parsed.message ? parsed.message : (typeof parsed === 'string' ? parsed : `HTTP ${response.status}`);
        throw new Error(msg);
    }

    if (response.status === 204) return null;
    const contentType = response.headers.get('Content-Type') || '';
    if (contentType.includes('application/json')) {
        return await response.json();
    } else {
        return await response.text();
    }
}