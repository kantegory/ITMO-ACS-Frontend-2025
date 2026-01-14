import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useNotification } from './useNotification'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()
  const { success, error } = useNotification()

  const user = computed(() => authStore.user)
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const fullName = computed(() => authStore.fullName)

  const login = async (email, password) => {
    const result = await authStore.login(email, password)
    if (result.success) {
      success('Login successful!')
      router.push('/profile')
    } else {
      error(result.error)
    }
    return result
  }

  const register = async (userData) => {
    const result = await authStore.register(userData)
    if (result.success) {
      success('Registration successful!')
      router.push('/profile')
    } else {
      error(result.error)
    }
    return result
  }

  const logout = () => {
    authStore.logout()
    success('Logged out successfully!')
    router.push('/')
  }

  return { user, isAuthenticated, fullName, login, register, logout }
}
