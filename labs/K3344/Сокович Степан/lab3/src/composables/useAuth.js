import { ref, computed } from 'vue'
import { useApi } from './useApi'
import { useRouter } from 'vue-router'

const currentUser = ref(null)
const token = ref(localStorage.getItem('token') || null)

export const useAuth = () => {
  const router = useRouter()
  const api = useApi()

  const isAuthenticated = computed(() => !!token.value)

  const loadUser = async () => {
    if (!token.value) {
      currentUser.value = null
      return null
    }

    try {
      const sessions = await api.get('/sessions')
      const session = sessions.find(s => s.token === token.value)
      if (!session) {
        token.value = null
        localStorage.removeItem('token')
        currentUser.value = null
        return null
      }

      const user = await api.get(`/users/${session.userId}`)
      currentUser.value = user
      return user
    } catch (error) {
      console.error('Error loading user:', error)
      token.value = null
      localStorage.removeItem('token')
      currentUser.value = null
      return null
    }
  }

  const register = async (email, password) => {
    try {
      const users = await api.get('/users')
      const existingUser = users.find(u => u.email === email)
      
      if (existingUser) {
        throw new Error('Пользователь с таким email уже существует')
      }

      const newUser = await api.post('/users', {
        email,
        password,
        username: email,
        phone: ''
      })

      const newToken = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      await api.post('/sessions', {
        userId: newUser.id,
        token: newToken,
        createdAt: new Date().toISOString()
      })

      token.value = newToken
      localStorage.setItem('token', newToken)
      currentUser.value = newUser

      return { user: newUser, token: newToken }
    } catch (err) {
      throw err
    }
  }

  const login = async (email, password) => {
    try {
      const users = await api.get('/users')
      const user = users.find(u => u.email === email && u.password === password)

      if (!user) {
        throw new Error('Неверный email или пароль')
      }

      const newToken = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      await api.post('/sessions', {
        userId: user.id,
        token: newToken,
        createdAt: new Date().toISOString()
      })

      token.value = newToken
      localStorage.setItem('token', newToken)
      currentUser.value = user

      return { user, token: newToken }
    } catch (err) {
      throw err
    }
  }

  const logout = async () => {
    try {
      if (token.value) {
        const sessions = await api.get('/sessions')
        const session = sessions.find(s => s.token === token.value)
        if (session) {
          await api.delete(`/sessions/${session.id}`)
        }
      }
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      token.value = null
      localStorage.removeItem('token')
      currentUser.value = null
      router.push('/')
    }
  }

  if (token.value) {
    loadUser()
  }

  return {
    currentUser: computed(() => currentUser.value),
    isAuthenticated,
    register,
    login,
    logout,
    loadUser
  }
}

