import {defineStore} from 'pinia'
import {ref, computed} from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('access_token') || null)
  const currentUser = ref(JSON.parse(localStorage.getItem('current_user') || 'null'))

  const isLoggedIn = computed(() => !!token.value)

  const getUserIdFromToken = (tokenStr) => {
    if (!tokenStr) return null
    try {
      const payload = tokenStr.split('.')[1]
      const decoded = JSON.parse(atob(payload))
      return decoded.user_id || decoded.sub
    } catch (e) {
      return null
    }
  }

  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('access_token', newToken)
  }

  const setCurrentUser = (user) => {
    currentUser.value = user
    localStorage.setItem('current_user', JSON.stringify(user))
  }

  const logout = () => {
    token.value = null
    currentUser.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('current_user')
  }

  return {
    token,
    currentUser,
    isLoggedIn,
    setToken,
    setCurrentUser,
    logout,
    getUserIdFromToken
  }
})
