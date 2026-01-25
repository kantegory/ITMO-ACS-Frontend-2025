import { defineStore } from 'pinia'

export const useBookingsStore = defineStore('bookings', {
  state: () => ({
    items: [], // {id, restaurantId, restaurantName, date, time, guests, comment}
  }),
  actions: {
    add(booking) {
      this.items.unshift({ id: crypto.randomUUID(), ...booking })
    },
    remove(id) {
      this.items = this.items.filter(b => b.id !== id)
    },
  },
})
