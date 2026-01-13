import api from './api'

export const bookingService = {
  getAll() {
    return api.get('/bookings')
  },

  getById(id) {
    return api.get(`/bookings/${id}`)
  },

  getUserBookings(userId) {
    return api.get(`/bookings?userId=${userId}`)
  },

  async create(bookingData) {
    return api.post('/bookings', {
      ...bookingData,
      createdAt: new Date().toISOString(),
      status: 'active'
    })
  },

  cancel(id) {
    return api.delete(`/bookings/${id}`)
  },

  update(id, data) {
    return api.patch(`/bookings/${id}`, data)
  }
}