import { ref } from 'vue'
import { api } from '../api'

export function useBookings() {
  const bookings = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchBookings = async (email) => {
    loading.value = true
    try {
      const res = await api.getBookings(email)
      bookings.value = res.data
      error.value = null
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const createBooking = async (booking) => {
    try {
      await api.createBooking(booking)
      bookings.value.push(booking)
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  }

  return { bookings, loading, error, fetchBookings, createBooking }
}
