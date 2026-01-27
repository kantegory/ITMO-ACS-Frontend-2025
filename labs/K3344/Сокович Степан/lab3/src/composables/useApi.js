import axios from 'axios'
import { ref } from 'vue'

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
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const useApi = () => {
  const loading = ref(false)
  const error = ref(null)

  const request = async (method, endpoint, data = null) => {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient[method](endpoint, data)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || err.message || 'Произошла ошибка'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    get: (endpoint) => request('get', endpoint),
    post: (endpoint, data) => request('post', endpoint, data),
    put: (endpoint, data) => request('put', endpoint, data),
    delete: (endpoint) => request('delete', endpoint),
    patch: (endpoint, data) => request('patch', endpoint, data)
  }
}

