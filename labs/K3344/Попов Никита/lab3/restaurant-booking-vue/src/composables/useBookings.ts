import { ref } from 'vue'
import { bookingsAPI } from '@/api'
import type { Booking } from '@/types'

export function useBookings() {
  const bookings = ref<Booking[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchBookingsByUserId = async (userId: number) => {
    loading.value = true
    error.value = null
    try {
      bookings.value = await bookingsAPI.getByUserId(userId)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка загрузки бронирований'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const createBooking = async (booking: Booking) => {
    loading.value = true
    error.value = null
    try {
      await bookingsAPI.create(booking)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка создания бронирования'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteBooking = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await bookingsAPI.delete(id)
      bookings.value = bookings.value.filter(b => b.id !== id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка удаления бронирования'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    bookings,
    loading,
    error,
    fetchBookingsByUserId,
    createBooking,
    deleteBooking
  }
}

