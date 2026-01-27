const BACKEND_URL = 'http://localhost:3000';
const TOKEN_KEY = 'access_token';

function saveToken(token) {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
}

function readToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function getAuthHeaders() {
    const token = readToken();
    return token ? { Authorization: 'Bearer ' + token } : {};
}

async function sendRequest(url, method = 'GET', body = null, extraHeaders = {}) {
    const headers = { 'Content-Type': 'application/json', ...getAuthHeaders(), ...extraHeaders };
    const options = { method, headers };
    if (body !== null) options.body = JSON.stringify(body);

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (response.ok) {
            return { success: true, data };
        } else {
            return { success: false, error: data.error || data.message || data.detail || 'Server error', status: response.status };
        }
    } catch (err) {
        return { success: false, error: err.message || err };
    }
}