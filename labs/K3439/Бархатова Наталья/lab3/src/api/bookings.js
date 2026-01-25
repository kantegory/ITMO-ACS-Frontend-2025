class BookingsApi {
  constructor(instance) {
    this.API = instance
  }

  getBookings = async (filters = {}) => {
    return this.API.get('/bookings', { params: filters })
  }

  createBooking = async (data) => {
    return this.API.post('/bookings', data)
  }
}

export default BookingsApi
