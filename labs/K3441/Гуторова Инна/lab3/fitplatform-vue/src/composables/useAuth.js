import { ref, computed } from 'vue'

const user = ref(JSON.parse(localStorage.getItem('user')))
const token = ref(localStorage.getItem('token'))

export function useAuth() {
  const login = (data) => {
    user.value = data.user
    token.value = data.accessToken
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('token', data.accessToken)
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.clear()
  }

  const isAuthenticated = computed(() => !!token.value)

  return { user, token, isAuthenticated, login, logout }
}
