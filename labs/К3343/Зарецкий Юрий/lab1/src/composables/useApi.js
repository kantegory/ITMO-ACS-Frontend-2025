import axios from 'axios'
import { useStorage } from './useStorage'
import { useRouter } from 'vue-router'

const API_BASE_URL = 'http://localhost:3001'

/**
 * Composable для настройки и использования API клиента
 * Создает экземпляр axios с interceptors для авторизации и обработки ошибок
 */
export function useApi() {
  const { get, remove } = useStorage()
  const router = useRouter()

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

  // Interceptor для обработки ошибок
  api.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        // Если получили 401, удаляем токен
        remove('authToken')
        remove('currentUser')

        // Перенаправляем на страницу входа только если мы не на публичных страницах
        const publicPages = ['/', '/login', '/register', '/search', '/property']
        const currentPath = router.currentRoute.value.path

        if (!publicPages.includes(currentPath)) {
          router.push('/login')
        }
      }
      return Promise.reject(error)
    }
  )

  return {
    api
  }
}
