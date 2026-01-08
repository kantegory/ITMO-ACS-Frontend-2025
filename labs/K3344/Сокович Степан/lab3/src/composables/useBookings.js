import { ref } from 'vue'
import { useApi } from './useApi'
import { useAuth } from './useAuth'

export const useBookings = () => {
  const api = useApi()
  const { currentUser } = useAuth()
  const bookings = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchBookings = async () => {
    if (!currentUser.value) {
      bookings.value = []
      return
    }

    loading.value = true
    error.value = null
    try {
      const allBookings = await api.get('/bookings')
      bookings.value = allBookings.filter(b => b.userId === currentUser.value.id)
    } catch (err) {
      error.value = err.message
      bookings.value = []
    } finally {
      loading.value = false
    }
  }

  const createBooking = async (listingId, startDate, endDate) => {
    if (!currentUser.value) {
      throw new Error('Необходима авторизация')
    }

    loading.value = true
    error.value = null
    try {
      const booking = await api.post('/bookings', {
        userId: currentUser.value.id,
        listingId,
        startDate,
        endDate,
        status: 'active'
      })
      bookings.value.push(booking)
      return booking
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const cancelBooking = async (bookingId) => {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/bookings/${bookingId}`)
      bookings.value = bookings.value.filter(b => b.id !== bookingId)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    createBooking,
    cancelBooking
  }
}

