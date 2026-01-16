import { defineStore } from 'pinia'
import { userApi } from '@/api'
import { restaurantApi } from '@/api'



export const useProfileStore = defineStore('profile', {
  state: () => ({
    user: null,
    bookings: [],
    restaurantsMap: {},
    error: null,
    loading: false
  }),

  actions: {
    async loadProfile(userId) {
      try {
        this.loading = true
        const [userRes, bookingsRes, restaurantsRes] = await Promise.all([
          userApi.getUser(userId),
          userApi.getBookings(userId),
          restaurantApi.getRestaurants()
        ])

        this.user = userRes.data
        this.bookings = bookingsRes.data

        this.restaurantsMap = {}
        restaurantsRes.data.forEach(r => {
          this.restaurantsMap[r.id] = r.name
        })

        this.error = null
      } catch (e) {
        console.error(e)
        this.error = 'Не удалось загрузить профиль'
      } finally {
        this.loading = false
      }
    },

    async updateProfile(data) {
      if (!this.user) return
      try {
        const res = await userApi.updateProfile(this.user.id, data)
        this.user = res.data
      } catch (e) {
        console.error(e)
      }
    }
  },

  getters: {
    upcomingBookings() {
      const now = new Date()
      return this.bookings
        .map(b => ({
          ...b,
          restaurantName: this.restaurantsMap[b.restaurantId] || 'Неизвестный ресторан',
          dateTime: new Date(`${b.date}T${b.time}`)
        }))
        .filter(b => b.dateTime >= now)
    },

    pastBookings() {
      const now = new Date()
      return this.bookings
        .map(b => ({
          ...b,
          restaurantName: this.restaurantsMap[b.restaurantId] || 'Неизвестный ресторан',
          dateTime: new Date(`${b.date}T${b.time}`)
        }))
        .filter(b => b.dateTime < now)
    }
  }
})
