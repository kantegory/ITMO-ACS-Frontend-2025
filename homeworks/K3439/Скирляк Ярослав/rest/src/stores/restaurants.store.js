import { defineStore } from 'pinia'
import { fetchRestaurants, fetchRestaurantById } from '../api/restaurantsApi'
import { useBookingsStore } from './bookings.store'

export const useRestaurantsStore = defineStore('restaurants', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
  }),
  getters: {
    bookingsCount: () => {
      const bookings = useBookingsStore()
      return bookings.items.length
    },
  },
  actions: {
    async loadAll() {
      this.loading = true
      this.error = null
      try {
        this.items = await fetchRestaurants()
      } catch (e) {
        this.error = e?.message ?? 'Ошибка загрузки'
      } finally {
        this.loading = false
      }
    },
    async loadById(id) {
      return await fetchRestaurantById(id)
    },
  },
})
