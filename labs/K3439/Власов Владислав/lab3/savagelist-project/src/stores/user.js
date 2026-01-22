import { defineStore } from 'pinia'
import { usersApi, authApi } from '@/api'

const useUserStore = defineStore('user', {
  state: () => ({
    id: 0,
    name: 'Имя не получено',
    email: 'Почта не получена',
    token: ''
  }),

  actions: {

    async getToken(data) {
      console.log(`Вот такие токен данные`, data)

      const response = await authApi.login(data)

      console.log(response.data)

      this.token = response.data.token

      return response
    },

    async getUserByEmail(data) {
      console.log(`Вот такие данные`, data)
      const response = await usersApi.getUserByEmail(data.email, this.token)
      
      console.log(response.data)

      response.data
      this.id = response.data.id
      this.name = response.data.name
      this.email = response.data.email

      return response
    },

    async updateUser(data) {
      
      console.log(this.token)
      const response = await usersApi.updateUser(data, this.id, this.token)

      console.log(response.data)

      this.name = response.data.name
      this.email = response.data.email

      return response
    },

    async createUser(data) {
        return await usersApi.createUser(data)
    }
  },

  persist: {
    enabled: true,
    strategies: [{
      key: 'user-store', 
      storage: localStorage,
    }]
  }

})

export default useUserStore