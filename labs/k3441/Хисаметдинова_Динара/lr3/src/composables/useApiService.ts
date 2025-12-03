import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

interface Property {
  id: number
  title: string
  location: string
  type: string
  price: number
  rating: number
  reviews: number
  image: string
  amenities: string[]
  maxGuests: number
  bedrooms: number
  bathrooms: number
  description: string
}

interface LoginResponse {
  success: boolean
  user?: any
  token?: string
  message?: string
}

interface RegisterResponse {
  success: boolean
  user?: any
  token?: string
  message?: string
}

interface PropertiesResponse {
  success: boolean
  data?: Property[]
  message?: string
}

export const useApiService = () => {
  const apiService = {
    // Authentication methods
    async login(email: string, password: string): Promise<LoginResponse> {
      try {
        console.log('Login attempt for:', email)

        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')
        const defaultUsers = [
          {
            id: 1,
            email: 'test@example.com',
            password: 'password123',
            firstName: 'G0lovach',
            lastName: 'Helen',
            isLoggedIn: false
          },
          {
            id: 2,
            email: 'user@rentaparts.com',
            password: 'rentaparts2024',
            firstName: 'Jane',
            lastName: 'Smith',
            isLoggedIn: false
          }
        ]

        const allUsers = [...defaultUsers, ...existingUsers.filter((u: any) => !defaultUsers.find(d => d.email === u.email))]
        const user = allUsers.find((u: any) => u.email === email && u.password === password)

        if (user) {
          user.isLoggedIn = true
          localStorage.setItem('users', JSON.stringify(allUsers))

          const token = btoa(JSON.stringify({ id: user.id, email: user.email, timestamp: Date.now() }))
          localStorage.setItem('authToken', token)
          localStorage.setItem('user', JSON.stringify({ ...user, password: undefined }))

          console.log('Login successful for:', user.email)
          return {
            success: true,
            user: { ...user, password: undefined },
            token
          }
        } else {
          console.log('Login failed: Invalid credentials')
          return { success: false, message: 'Invalid credentials' }
        }
      } catch (error) {
        console.error('Login error:', error)
        return { success: false, message: 'Login failed' }
      }
    },

    async register(userData: any): Promise<RegisterResponse> {
      try {
        console.log('Registration attempt for:', userData.email)

        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')
        const existingUser = existingUsers.find((u: any) => u.email === userData.email)

        if (existingUser) {
          return { success: false, message: 'User already exists' }
        }

        const newUser = {
          ...userData,
          id: Date.now(),
          isLoggedIn: true,
          registrationTime: new Date().toISOString()
        }

        existingUsers.push(newUser)
        localStorage.setItem('users', JSON.stringify(existingUsers))

        const token = btoa(JSON.stringify({ id: newUser.id, email: newUser.email, timestamp: Date.now() }))
        localStorage.setItem('authToken', token)
        localStorage.setItem('user', JSON.stringify({ ...newUser, password: undefined }))

        console.log('Registration successful for:', newUser.email)
        return {
          success: true,
          user: { ...newUser, password: undefined },
          token
        }
      } catch (error) {
        console.error('Registration error:', error)
        return { success: false, message: 'Registration failed' }
      }
    },

    async logout(userId?: number) {
      try {
        console.log('Logout for user ID:', userId)

        if (userId) {
          const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')
          const userIndex = existingUsers.findIndex((u: any) => u.id === userId)
          if (userIndex !== -1) {
            existingUsers[userIndex].isLoggedIn = false
            localStorage.setItem('users', JSON.stringify(existingUsers))
          }
        }

        localStorage.removeItem('authToken')
        localStorage.removeItem('user')

        console.log('Logout successful')
        return { success: true }
      } catch (error) {
        console.error('Logout error:', error)
        return { success: false, message: 'Logout failed' }
      }
    },

    // Properties methods
    async getProperties(filters: any = {}): Promise<PropertiesResponse> {
      try {
        console.log('getProperties called, using local sample data...')

        const sampleProperties: Property[] = [
          {
            id: 1,
            title: 'Cozy Belgrade Apartment',
            location: 'Belgrade, Serbia',
            type: 'apartment',
            price: 30,
            rating: 4.2,
            reviews: 47,
            image: '/images/cozy-belgrade-apartment.webp',
            amenities: ['wifi', 'kitchen', 'parking'],
            maxGuests: 4,
            bedrooms: 1,
            bathrooms: 1,
            description: 'Charming apartment in the heart of Belgrade with authentic Socialist architecture.'
          },
          {
            id: 2,
            title: 'Modern Krakow Loft',
            location: 'Krakow, Poland',
            type: 'apartment',
            price: 225,
            rating: 4.8,
            reviews: 112,
            image: '/images/modern-krakow-loft.webp',
            amenities: ['wifi', 'aircon', 'kitchen', 'washer'],
            maxGuests: 2,
            bedrooms: 1,
            bathrooms: 1,
            description: 'Contemporary loft in historic Krakow with modern amenities.'
          },
          {
            id: 3,
            title: 'Bucharest Studio',
            location: 'Bucharest, Romania',
            type: 'studio',
            price: 24,
            rating: 3.9,
            reviews: 33,
            image: '/images/bucharest-studio.webp',
            amenities: ['wifi', 'kitchen'],
            maxGuests: 2,
            bedrooms: 1,
            bathrooms: 1,
            description: 'Affordable studio apartment perfect for short stays in Bucharest.'
          }
          // ... more properties can be added
        ]

        // Apply filters
        let filteredData = sampleProperties

        if (filters.location) {
          filteredData = filteredData.filter(property =>
            property.location.toLowerCase().includes(filters.location.toLowerCase())
          )
        }

        if (filters.type) {
          filteredData = filteredData.filter(property => property.type === filters.type)
        }

        if (filters.minPrice) {
          filteredData = filteredData.filter(property => property.price >= filters.minPrice)
        }

        if (filters.maxPrice) {
          filteredData = filteredData.filter(property => property.price <= filters.maxPrice)
        }

        return { success: true, data: filteredData }
      } catch (error) {
        console.error('Error fetching properties:', error)
        return { success: false, message: 'Failed to fetch properties' }
      }
    },

    // Location methods
    async getUserLocation() {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported by this browser'))
          return
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy
            })
          },
          (error) => {
            let message = 'Location access denied'
            switch (error.code) {
              case error.PERMISSION_DENIED:
                message = 'Location access denied by user'
                break
              case error.POSITION_UNAVAILABLE:
                message = 'Location information unavailable'
                break
              case error.TIMEOUT:
                message = 'Location request timeout'
                break
            }
            reject(new Error(message))
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 600000
          }
        )
      })
    },

    // External API integration example
    async searchHotelsNearLocation(latitude: number, longitude: number) {
      try {
        // This is a mock implementation - in a real app you'd call an actual API
        console.log('Searching hotels near:', latitude, longitude)

        const mockHotels: Property[] = [
          {
            id: 1001,
            title: `Hotel near ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
            location: 'Near your location',
            type: 'hotel',
            price: Math.floor(Math.random() * 100) + 80,
            rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
            reviews: Math.floor(Math.random() * 100) + 10,
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
            amenities: ['WiFi', 'Pool', 'Restaurant'],
            maxGuests: 4,
            bedrooms: 2,
            bathrooms: 1,
            description: 'A nice hotel near your current location'
          }
        ]

        return { success: true, data: mockHotels }
      } catch (error) {
        console.error('Error searching hotels:', error)
        return { success: false, message: 'Failed to search hotels' }
      }
    }
  }

  return { apiService }
}