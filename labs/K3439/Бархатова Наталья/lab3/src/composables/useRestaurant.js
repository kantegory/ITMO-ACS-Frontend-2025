import { ref } from 'vue'
import { restaurantApi, bookingsApi } from '@/api'

export function useRestaurant(id) {
  const restaurant = ref(null)
  const freeTables = ref(null)
  const reviews = ref([])

  async function loadRestaurant() {
    const { data } = await restaurantApi.getRestaurant(id)
    restaurant.value = data
    reviews.value = data.reviews || []
  }

  async function checkTablesForDate(date) {
    const { data } = await bookingsApi.getBookings({ restaurantId: id, date })
    freeTables.value = restaurant.value.tablesCount - data.length
  }

  async function createBooking({ userId, date, time, people = 2, comment = '' }) {
    await bookingsApi.createBooking({
      restaurantId: id,
      userId,
      date,
      time,
      people,
      comment,
      createdAt: new Date().toISOString()
    })
  }

  return {
    restaurant,
    freeTables,
    reviews,
    loadRestaurant,
    checkTablesForDate,
    createBooking
  }
}
