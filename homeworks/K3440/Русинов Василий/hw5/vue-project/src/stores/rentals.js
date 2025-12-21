import { defineStore } from 'pinia'
import { rentalsApi } from '@/api'

export const useRentalsStore = defineStore('rentals', {
  state: () => ({
    rentals: []
  }),

  actions: {
    async loadRentals(userId) {
      const res = await rentalsApi.getUserRentals(userId)
      this.rentals = res.data
    },
    async rentHouse(data) {
      await rentalsApi.rentHouse(data)
      await this.loadRentals(data.userId)
    }
  },

  persist: true
})
