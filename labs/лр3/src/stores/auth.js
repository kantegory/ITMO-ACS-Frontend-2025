import { defineStore } from 'pinia'
import { authApi } from '@/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false
  }),

  getters: {
    currentUser: (state) => state.user,
    fullName: (state) => {
      if (!state.user) return 'Guest User'
      return `${state.user.firstName} ${state.user.lastName}`
    }
  },

  actions: {
    async login(email, password) {
      try {
        const response = await authApi.login(email, password)
        this.user = response.data
        this.isAuthenticated = true
        return { success: true }
      } catch (error) {
        return { 
          success: false, 
          error: error.response?.data?.error || 'Invalid email or password' 
        }
      }
    },

    async register(userData) {
      try {
        const check = await authApi.checkEmail(userData.email)
        if (check.data.length > 0) {
          return { success: false, error: 'User with this email already exists' }
        }

        const response = await authApi.register(userData)
        this.user = response.data
        this.isAuthenticated = true
        return { success: true }
      } catch (error) {
        return { 
          success: false, 
          error: error.response?.data?.error || 'Registration failed' 
        }
      }
    },

    logout() {
      this.user = null
      this.isAuthenticated = false
    }
  },

  persist: true
})
