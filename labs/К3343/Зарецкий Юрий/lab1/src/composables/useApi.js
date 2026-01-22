import axios from 'axios'

const API_BASE_URL = 'http://localhost:3001'

// Создаем экземпляр axios с базовой конфигурацией
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor для добавления токена авторизации к запросам
api.interceptors.request.use(
  (config) => {
    try {
      const tokenItem = localStorage.getItem('authToken')
      const token = tokenItem ? JSON.parse(tokenItem) : null
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (e) {
      console.error('Ошибка чтения токена:', e)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor для обработки ошибок (401 будет обработан в компонентах через router)
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Если получили 401, удаляем токен
      try {
        localStorage.removeItem('authToken')
        localStorage.removeItem('currentUser')
      } catch (e) {
        console.error('Ошибка удаления токена:', e)
      }
      
      // Редирект будет обработан в компонентах через router
    }
    return Promise.reject(error)
  }
)

/**
 * Composable для получения API клиента
 */
export function useApi() {
  return {
    api
  }
}
