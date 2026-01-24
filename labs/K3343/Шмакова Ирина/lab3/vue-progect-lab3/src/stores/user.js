import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: null
  }),

  persist: true,

  getters: {
    isAuthenticated: (state) => !!state.token
  },

  actions: {
    login(userData, authToken) {
      this.user = userData
      this.token = authToken
    },

    logout() {
      this.user = null
      this.token = null
    }
  }
})
