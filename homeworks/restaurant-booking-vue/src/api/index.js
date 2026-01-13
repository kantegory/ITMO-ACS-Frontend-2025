import axios from 'axios'

const API_URL = 'http://localhost:3000'

export const api = {
  getRestaurants: () => axios.get(`${API_URL}/restaurants`),
  getRestaurantById: (id) => axios.get(`${API_URL}/restaurants/${id}`),
  getBookings: (email) => axios.get(`${API_URL}/bookings?email=${email}`),
  createBooking: (booking) => axios.post(`${API_URL}/bookings`, booking),
  registerUser: (user) => axios.post(`${API_URL}/users`, user),
  loginUser: (email, password) => axios.get(`${API_URL}/users?email=${email}&password=${password}`)
}
