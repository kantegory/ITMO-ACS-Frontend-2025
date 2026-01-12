import axios from 'axios'
import type { Restaurant, AuthResponse, Booking, SearchFilters } from '@/types'

const API_BASE_URL = 'http://localhost:3000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor to add token to requests
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      throw new Error('Не удалось подключиться к серверу. Убедитесь, что JSON Server запущен (npm run server)')
    }
    throw error
  }
)

export const restaurantsAPI = {
  async getAll(): Promise<Restaurant[]> {
    const response = await api.get<Restaurant[]>('/restaurants')
    return response.data
  },

  async getById(id: string): Promise<Restaurant> {
    const response = await api.get<Restaurant>(`/restaurants/${id}`)
    return response.data
  },

  async search(filters: SearchFilters): Promise<Restaurant[]> {
    const params = new URLSearchParams()
    if (filters.cuisine) params.append('cuisine', filters.cuisine)
    if (filters.location) params.append('location', filters.location)
    if (filters.price) params.append('price', filters.price)
    
    const query = params.toString()
    const response = await api.get<Restaurant[]>(`/restaurants${query ? `?${query}` : ''}`)
    return response.data
  }
}

export const authAPI = {
  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/login', { username, password })
    
    if (response.data.success) {
      sessionStorage.setItem('token', response.data.token!)
      sessionStorage.setItem('user', JSON.stringify(response.data.user))
    }
    
    return response.data
  },

  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/register', { username, email, password })
    
    if (response.data.success) {
      sessionStorage.setItem('token', response.data.token!)
      sessionStorage.setItem('user', JSON.stringify(response.data.user))
    }
    
    return response.data
  },

  logout(): void {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
  },

  getCurrentUser() {
    const userStr = sessionStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('token')
  }
}

export const bookingsAPI = {
  async getByUserId(userId: number): Promise<Booking[]> {
    const response = await api.get<Booking[]>(`/bookings?userId=${userId}`)
    return response.data
  },

  async create(booking: Booking): Promise<Booking> {
    const response = await api.post<Booking>('/bookings', booking)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/bookings/${id}`)
  }
}

