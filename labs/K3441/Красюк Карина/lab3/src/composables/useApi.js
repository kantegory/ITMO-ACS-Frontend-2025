import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const message = error.response.data?.error || error.response.data?.message || `Ошибка: ${error.response.status}`
      return Promise.reject(new Error(message))
    } else if (error.request) {
      return Promise.reject(new Error('Не удалось подключиться к серверу. Убедитесь, что json-server запущен на http://localhost:3000'))
    }
    return Promise.reject(error)
  }
)

export function useApi() {
  return {
    apiClient,
    API_BASE_URL
  }
}

