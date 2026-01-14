import { ref } from 'vue'

const user = ref(JSON.parse(localStorage.getItem('user')))
const token = ref(localStorage.getItem('token'))

export function useAuth() {
  const login = (data) => {
    user.value = data.user
    token.value = data.accessToken
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.clear()
  }

  const isAuth = !!token.value

  return { user, token, isAuth, login, logout }
}
