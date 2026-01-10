import axios from 'axios'
import { useStorage } from './useStorage'

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
    const { get } = useStorage()
    try {
      const tokenItem = get('authToken')
      if (tokenItem) {
        config.headers.Authorization = `Bearer ${tokenItem}`
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
      const { remove } = useStorage()
      // Если получили 401, удаляем токен
      remove('authToken')
      remove('currentUser')
      
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
