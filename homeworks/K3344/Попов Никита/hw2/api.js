// API модуль для работы с JSON Server
const API_BASE_URL = 'http://localhost:3000';

async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const token = sessionStorage.getItem('token');
    if (token) {
        defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);
        
        if (!response.ok && response.status === 0) {
            throw new Error('Сервер не запущен. Запустите: npm run server');
        }
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Ошибка запроса');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            throw new Error('Не удалось подключиться к серверу. Убедитесь, что JSON Server запущен (npm run server)');
        }
        throw error;
    }
}

export const restaurantsAPI = {
    getAll: () => apiRequest('/restaurants'),

    getById: (id) => apiRequest(`/restaurants/${id}`),

    search: (filters) => {
        const params = new URLSearchParams();
        if (filters.cuisine) params.append('cuisine', filters.cuisine);
        if (filters.location) params.append('location', filters.location);
        if (filters.price) params.append('price', filters.price);
        
        const query = params.toString();
        return apiRequest(`/restaurants${query ? `?${query}` : ''}`);
    }
};

export const authAPI = {
    login: async (username, password) => {
        const response = await apiRequest('/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
        
        if (response.success) {
            sessionStorage.setItem('token', response.token);
            sessionStorage.setItem('user', JSON.stringify(response.user));
        }
        
        return response;
    },

    register: async (username, email, password) => {
        const response = await apiRequest('/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password }),
        });
        
        if (response.success) {
            sessionStorage.setItem('token', response.token);
            sessionStorage.setItem('user', JSON.stringify(response.user));
        }
        
        return response;
    },

    logout: () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const userStr = sessionStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated: () => {
        return !!sessionStorage.getItem('token');
    }
};

export const bookingsAPI = {
    getByUserId: async (userId) => {
        const bookings = await apiRequest(`/bookings?userId=${userId}`);
        return bookings;
    },

    create: async (booking) => {
        return apiRequest('/bookings', {
            method: 'POST',
            body: JSON.stringify(booking),
        });
    },

    delete: (id) => {
        return apiRequest(`/bookings/${id}`, {
            method: 'DELETE',
        });
    }
};

