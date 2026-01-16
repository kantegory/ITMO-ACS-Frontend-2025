import { defineStore } from 'pinia'
import { authApi } from '@/api'

const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    error: null
  }),

  actions: {
    async login(email, password) {
      try {
        const response = await authApi.getUsers()
        const users = response.data

        const user = users.find(
          u => u.email === email && u.password === password
        )

        if (!user) {
          this.error = 'Неверный email или пароль'
          return false
        }

        this.user = user
        this.token = user.token
        this.error = null
        localStorage.setItem('token', this.token)
        localStorage.setItem('userId', user.id)
        return true
      } catch (e) {
        this.error = 'Ошибка сервера'
        return false
      }
    },

    async register({ name, email, password }) {
      try {
        const response = await authApi.getUsers()
        const users = response.data

        const exists = users.some(u => u.email === email)
        if (exists) {
          this.error = "Пользователь с таким email уже существует"
          return false
        }

        const newUser = {
          name,
          email,
          password,
          token: "token-" + password
        }

        await authApi.createUser(newUser)

        this.error = null
        return true
      } catch (e) {
        this.error = "Ошибка сервера"
        return false
      }
    },

    clearError() {
      this.error = null
    },

    async updatePassword(userId, token, newPassword) {
      try {
        if (!userId || !token) {
          this.error = 'Нет доступа к аккаунту'
          return false
        }

        await authApi.updatePassword(userId, newPassword)
        this.error = null
        return true
      } catch (e) {
        console.error(e)
        this.error = 'Ошибка сервера'
        return false
      }
    }
  },
  persist: {
    paths: ['user', 'token']
  }
})

export default useAuthStore
