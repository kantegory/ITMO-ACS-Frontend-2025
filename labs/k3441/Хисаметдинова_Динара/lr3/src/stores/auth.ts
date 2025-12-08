import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApiService } from '@/composables/useApiService'

interface User {
  id: number
  email: string
  firstName: string
  lastName: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const { apiService } = useApiService()

  const initializeAuth = () => {
    const savedToken = localStorage.getItem('authToken')
    const savedUser = localStorage.getItem('user')

    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = JSON.parse(savedUser)
    }
  }

  const isAuthenticated = computed(() => {
    return !!token.value && !!user.value
  })

  const login = async (email: string, password: string) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiService.login(email, password)

      if (response.success) {
        user.value = response.user
        token.value = response.token || null
        return { success: true }
      } else {
        error.value = response.message || 'Login failed'
        return { success: false, message: error.value }
      }
    } catch (err) {
      error.value = 'Login failed'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const register = async (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
  }) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiService.register(userData)

      if (response.success) {
        user.value = response.user
        token.value = response.token || null
        return { success: true }
      } else {
        error.value = response.message || 'Registration failed'
        return { success: false, message: error.value }
      }
    } catch (err) {
      error.value = 'Registration failed'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      if (user.value) {
        await apiService.logout(user.value.id)
      }
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      user.value = null
      token.value = null
      error.value = null
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    user: computed(() => user.value),
    token: computed(() => token.value),
    isAuthenticated,
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    initializeAuth,
    login,
    register,
    logout,
    clearError
  }
})