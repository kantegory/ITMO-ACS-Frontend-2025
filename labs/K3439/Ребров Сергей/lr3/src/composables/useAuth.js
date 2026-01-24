import { ref } from 'vue'
import useApi from './useApi'

const user = ref(null)

function loadUserFromStorage() {
  try {
    const u = localStorage.getItem('user')
    user.value = u ? JSON.parse(u) : null
  } catch (e) { user.value = null }
}
loadUserFromStorage()

export function getToken() {
  return localStorage.getItem('token')
}

export function useAuth() {
  const { api } = useApi()

  async function login({ email, password }) {
    const res = await api.post('/login', { email, password })
    const { token, user: u } = res.data
    if (token) {
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(u || null))
      user.value = u || null
    }
    return res.data
  }

  async function register(payload) {
    const res = await api.post('/register', payload)
    return res.data
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    user.value = null
  }

  function currentUser() {
    if (!user.value) loadUserFromStorage()
    return user
  }

  return { login, register, logout, currentUser }
}