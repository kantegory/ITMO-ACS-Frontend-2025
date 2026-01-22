import { useRouter } from 'vue-router'
import api from '../api/instance.js'

export default function useAuth() {
  const router = useRouter()

  const register = async ({ username, email, password, confirmPassword, name, bio }) => {
    if (password !== confirmPassword) {
      throw 'Passwords do not match'
    }

    if (password.length < 6) {
      throw 'Password must be at least 6 characters'
    }

    const res = await api.post('/register', {
      email,
      password,
      username
    })

    const { accessToken, user } = res.data
    const updatedUserRes = await api.patch(`/users/${user.id}`, { name, bio },
      { headers: { Authorization: `Bearer ${accessToken}` }}
    )

    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('user', JSON.stringify(updatedUserRes.data))

    router.push('/login')
  }

  const login = async ({ email, password }) => {
    const res = await api.post('/login', { email, password })

    localStorage.setItem('accessToken', res.data.accessToken)
    localStorage.setItem('user', JSON.stringify(res.data.user))

    router.push('/main')
  }

  const logout = () => {
    localStorage.clear()
    router.push('/')
  }

  const isAuth = () => {
    return !localStorage.getItem('accessToken')
  }

  return {
    register,
    login,
    logout,
    isAuth
  }
}
