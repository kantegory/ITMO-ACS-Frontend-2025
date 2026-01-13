import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'

const API_URL = 'http://localhost:3000'

export function useAuth() {
  const router = useRouter()
  const authStore = useAuthStore()
  const error = ref(null)
  const loading = ref(false)

  const register = async (userData) => {
    try {
      loading.value = true
      error.value = null

      const response = await axios.post(`${API_URL}/register`, {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        phone: userData.phone
      })

      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Ошибка регистрации'
      throw err
    } finally {
      loading.value = false
    }
  }

  const login = async (email, password) => {
    try {
      loading.value = true
      error.value = null

      const response = await axios.post(`${API_URL}/login`, {
        email,
        password
      })

      const { accessToken, user } = response.data

      localStorage.setItem('token', accessToken)
      localStorage.setItem('user', JSON.stringify(user))

      authStore.setUser(user)
      router.push('/')

      return user
    } catch (err) {
      error.value = err.response?.data || 'Неверный email или пароль'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    authStore.logout()
    router.push('/login')
  }

  return {
    error,
    loading,
    register,
    login,
    logout
  }
}