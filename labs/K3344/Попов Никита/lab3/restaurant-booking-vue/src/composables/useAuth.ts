import { ref, computed } from 'vue'
import { authAPI } from '@/api'
import type { User } from '@/types'

const currentUser = ref<User | null>(authAPI.getCurrentUser())

export function useAuth() {
  const isAuthenticated = computed(() => !!currentUser.value)

  const login = async (username: string, password: string) => {
    const response = await authAPI.login(username, password)
    if (response.success) {
      currentUser.value = response.user!
    }
    return response
  }

  const register = async (username: string, email: string, password: string) => {
    const response = await authAPI.register(username, email, password)
    if (response.success) {
      currentUser.value = response.user!
    }
    return response
  }

  const logout = () => {
    authAPI.logout()
    currentUser.value = null
  }

  return {
    currentUser,
    isAuthenticated,
    login,
    register,
    logout
  }
}

