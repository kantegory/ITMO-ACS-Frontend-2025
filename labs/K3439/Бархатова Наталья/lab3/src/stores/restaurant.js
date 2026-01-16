import { defineStore } from 'pinia'
import { restaurantApi } from '@/api'

export const useRestaurantsStore = defineStore('restaurants', {
  state: () => ({
    restaurants: [],
    error: null,
    loading: false
  }),

  actions: {
    async loadRestaurants(filters = {}) {
      try {
        this.loading = true
        const { data } = await restaurantApi.getRestaurants(filters)
        this.restaurants = data
        this.error = null
      } catch (e) {
        console.error(e)
        this.error = 'Не удалось загрузить рестораны'
      } finally {
        this.loading = false
      }
    }
  }
})
