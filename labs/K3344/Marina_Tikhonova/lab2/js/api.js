// Конфигурация API
const API_BASE_URL = 'http://localhost:3000';

// Создание экземпляра axios с базовой конфигурацией
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});