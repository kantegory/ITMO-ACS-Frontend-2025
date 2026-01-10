import axios from 'axios'
import { useStorage } from '../composables/useStorage'

const API_BASE_URL = 'http://localhost:3001'

// Создаем экземпляр axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor для добавления токена авторизации
api.interceptors.request.use(
  (config) => {
    const { get } = useStorage()
    try {
      const token = get('authToken')
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

// Interceptor для обработки ошибок (401 будет обработан в useApi composable)
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
)

/**
 * API сервис для работы с пользователями
 */
export const login = async (email, password) => {
  const response = await api.post('/login', { email, password })
  const { user, token } = response.data
  return { user, token }
}

export const register = async (userData) => {
  const response = await api.post('/register', userData)
  const { user, token } = response.data
  return { user, token }
}

export const getUsers = async () => {
  const response = await api.get('/users')
  return response.data
}

export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`)
  return response.data
}

/**
 * API сервис для работы с недвижимостью
 */
export const getApartments = async (filters = {}) => {
  const params = new URLSearchParams()
  
  if (filters.search) {
    params.append('search', filters.search)
  }
  if (filters.type) {
    params.append('type', filters.type)
  }
  if (filters.location) {
    params.append('location', filters.location)
  }
  if (filters.minPrice) {
    params.append('minPrice', filters.minPrice)
  }
  if (filters.maxPrice) {
    params.append('maxPrice', filters.maxPrice)
  }
  if (filters.rooms) {
    params.append('rooms', filters.rooms)
  }
  if (filters.ownerId) {
    params.append('ownerId', filters.ownerId)
  }
  
  const queryString = params.toString()
  const url = queryString ? `/apartments?${queryString}` : '/apartments'
  const response = await api.get(url)
  return response.data
}

export const getApartmentById = async (id) => {
  const response = await api.get(`/apartments/${id}`)
  return response.data
}

export const getUserApartments = async (userId) => {
  const response = await api.get(`/apartments?ownerId=${userId}`)
  return response.data
}

export const getRentedApartments = async (userId) => {
  const response = await api.get(`/rentedApartments?tenantId=${userId}`)
  return response.data
}

export const rentApartment = async (apartmentId, userId, rentData) => {
  const response = await api.post('/rentedApartments', {
    apartmentId: apartmentId,
    tenantId: userId,
    startDate: rentData.startDate,
    endDate: rentData.endDate,
    guests: rentData.guests
  })
  return response.data
}
