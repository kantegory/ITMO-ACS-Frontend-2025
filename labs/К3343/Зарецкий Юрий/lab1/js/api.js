const API_BASE_URL = 'http://localhost:3001';

// Создаем экземпляр axios с базовой конфигурацией
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor для добавления токена авторизации к запросам
api.interceptors.request.use(
    (config) => {
        const token = Storage.get(Storage.keys.authToken);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor для обработки ошибок
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Если получили 401, удаляем токен
            Storage.remove(Storage.keys.authToken);
            Storage.remove(Storage.keys.currentUser);
            
            // Перенаправляем на страницу входа только если мы не на публичных страницах
            const currentPath = window.location.pathname;
            const currentPage = currentPath.split('/').pop() || 'index.html';
            const publicPages = ['index.html', 'login.html', 'register.html', 'search.html', 'property.html'];
            
            // Не перенаправляем на публичных страницах
            if (!publicPages.includes(currentPage) && !currentPath.includes('login.html') && !currentPath.includes('register.html')) {
                window.location.href = 'login.html';
            }
        }
        return Promise.reject(error);
    }
);

// API сервис для работы с пользователями
const UserAPI = {
    login: async function(email, password) {
        try {
            const response = await api.post('/login', { email, password });
            const { user, token } = response.data;
            
            // Сохраняем токен и пользователя
            Storage.set(Storage.keys.authToken, token);
            Storage.set(Storage.keys.currentUser, user);
            
            return { user, token };
        } catch (error) {
            console.error('Ошибка авторизации:', error);
            throw error;
        }
    },

    register: async function(userData) {
        try {
            const response = await api.post('/register', userData);
            const { user, token } = response.data;
            
            // Сохраняем токен и пользователя
            Storage.set(Storage.keys.authToken, token);
            Storage.set(Storage.keys.currentUser, user);
            
            return { user, token };
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            throw error;
        }
    },

    getUsers: async function() {
        try {
            const response = await api.get('/users');
            return response.data;
        } catch (error) {
            console.error('Ошибка получения пользователей:', error);
            throw error;
        }
    },

    getUserById: async function(id) {
        try {
            const response = await api.get(`/users/${id}`);
            return response.data;
        } catch (error) {
            console.error('Ошибка получения пользователя:', error);
            throw error;
        }
    }
};

// API сервис для работы с недвижимостью
const ApartmentAPI = {
    getApartments: async function() {
        try {
            const response = await api.get('/apartments');
            return response.data;
        } catch (error) {
            console.error('Ошибка получения недвижимости:', error);
            throw error;
        }
    },

    getApartmentById: async function(id) {
        try {
            const response = await api.get(`/apartments/${id}`);
            return response.data;
        } catch (error) {
            console.error('Ошибка получения недвижимости:', error);
            throw error;
        }
    },

    getUserApartments: async function(userId) {
        try {
            const response = await api.get(`/apartments?ownerId=${userId}`);
            return response.data;
        } catch (error) {
            console.error('Ошибка получения недвижимости пользователя:', error);
            throw error;
        }
    },

    getRentedApartments: async function(userId) {
        try {
            const response = await api.get(`/rentedApartments?tenantId=${userId}`);
            return response.data;
        } catch (error) {
            console.error('Ошибка получения арендованной недвижимости:', error);
            throw error;
        }
    },

    rentApartment: async function(apartmentId, userId, rentData) {
        try {
            const response = await api.post('/rentedApartments', {
                apartmentId: apartmentId,
                tenantId: userId,
                startDate: rentData.startDate,
                endDate: rentData.endDate,
                guests: rentData.guests
            });
            return response.data;
        } catch (error) {
            console.error('Ошибка аренды недвижимости:', error);
            throw error;
        }
    }
};
