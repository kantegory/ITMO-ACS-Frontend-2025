export const API_BASE = window.API_BASE || "http://localhost:4000";

export function getToken() {
    return localStorage.getItem('token');
}

export function setToken(token) {
    localStorage.setItem('token', token);
}

export function removeToken() {
    localStorage.removeItem('token');
}

async function parseErrorBody(res) {
    try {
        const txt = await res.text();
        try {
            return JSON.parse(txt);
        } catch (e) {
            return { message: txt };
        }
    } catch (e) {
        return { message: `HTTP ${res.status}` };
    }
}

export async function request(path, method = "GET", body = null, opts = {}) {
    const token = getToken();
    const headers = opts.headers ? {...opts.headers} : {};

    if (!(body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers,
    };

    if (body) {
        if (body instanceof FormData) {
            config.body = body;
        } else {
            config.body = JSON.stringify(body);
        }
    }

    try {
        console.log(`Making ${method} request to ${path}`, { body: body instanceof FormData ? '[FormData]' : body });

        const response = await fetch(API_BASE + path, config);
        console.log(`Response status: ${response.status}`);

        if (!response.ok) {
            if (response.status === 401) {
                removeToken();
                localStorage.removeItem('user');
                console.log('Token expired, redirecting to login');

                if (!window.location.pathname.includes('login.html') &&
                    !window.location.pathname.includes('register.html')) {
                    window.location.href = 'login.html';
                }
            }

            const parsed = await parseErrorBody(response);
            const errorMsg = parsed.message || parsed.error || `HTTP ${response.status}`;
            console.error('Request failed:', errorMsg);
            throw new Error(errorMsg);
        }

        if (response.status === 204) return null;

        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            console.log('Response data:', data);
            return data;
        }

        const textData = await response.text();
        console.log('Response text:', textData);
        return textData;

    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

export async function login(email, password) {
    try {
        const data = await request('/auth/login', 'POST', { email, password });
        if (data.token) {
            setToken(data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        return data.user;
    } catch (error) {
        console.error('Login error:', error);
        throw new Error(error.message || 'Ошибка входа. Проверьте email и пароль.');
    }
}

export async function register(email, password, username) {
    try {
        const data = await request('/auth/register', 'POST', { email, password, username });
        if (data.token) {
            setToken(data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        return data.user;
    } catch (error) {
        console.error('Register error:', error);
        throw new Error(error.message || 'Ошибка регистрации. Возможно, email уже используется.');
    }
}

export async function logoutApi() {
    try {
        await request('/auth/logout', 'POST');
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        removeToken();
        localStorage.removeItem('user');
    }
}

export async function getCurrentUserApi() {
    try {
        const localUser = getCurrentUser();
        if (!localUser || !localUser.id) {
            console.log('No local user found');
            return null;
        }

        console.log('Fetching user data for ID:', localUser.id);
        return await getUserById(localUser.id);

    } catch (error) {
        console.error('Failed to get current user from API:', error);
        return null;
    }
}

export async function getUserById(id) {
    try {
        if (!id) {
            throw new Error('User ID is required');
        }
        return await request(`/users/${id}`, 'GET');
    } catch (error) {
        console.error('Failed to get user by ID:', error);
        throw new Error(error.message || 'Не удалось получить данные пользователя');
    }
}

export async function updateUser(id, userData) {
    try {
        if (!id) {
            throw new Error('User ID is required');
        }

        console.log(`Updating user ${id} with data:`, userData);
        const updatedUser = await request(`/users/${id}`, 'PUT', userData);

        const currentUser = getCurrentUser();
        if (currentUser && currentUser.id === id) {
            const mergedUser = { ...currentUser, ...updatedUser };
            localStorage.setItem('user', JSON.stringify(mergedUser));
            console.log('Local user data updated:', mergedUser);
        }

        return updatedUser;
    } catch (error) {
        console.error('Failed to update user:', error);
        throw new Error(error.message || 'Не удалось обновить данные пользователя');
    }
}

export function getCurrentUser() {
    try {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        return null;
    }
}

export function setCurrentUser(user) {
    try {
        localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
        console.error('Error saving user to localStorage:', error);
    }
}

export function isAuthenticated() {
    const token = getToken();
    const user = getCurrentUser();
    const authenticated = !!token && !!user;
    console.log('isAuthenticated check:', { token: !!token, user: !!user, authenticated });
    return authenticated;
}