// все обращения к json-server через axios в одном месте
import axios from 'axios'

const API_BASE = 'http://localhost:3000'

export function useApi() {
  // получаем список всех ресторанов
  async function fetchRestaurants() {
    const res = await axios.get(`${API_BASE}/restaurants`)
    return res.data
  }

  // получаем данные одного ресторана по id
  async function fetchRestaurantById(id) {
    const res = await axios.get(`${API_BASE}/restaurants/${id}`)
    return res.data
  }

  // авторизация — ищем пользователя по email и паролю
  async function loginUser(email, password) {
    const res = await axios.get(
      `${API_BASE}/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    )
    return res.data.length ? res.data[0] : null
  }

  // регистрация нового пользователя
  async function registerUser(name, email, password) {
    const checkRes = await axios.get(`${API_BASE}/users?email=${encodeURIComponent(email)}`)
    if (checkRes.data.length) throw new Error('User exists')

    const res = await axios.post(`${API_BASE}/users`, { name, email, password })
    return res.data
  }

  // получаем все бронирования пользователя
  async function fetchBookingsForUser(userId) {
    const res = await axios.get(`${API_BASE}/bookings?userId=${userId}`)
    return res.data
  }

  // создаём новое бронирование
  async function createBooking(booking) {
    const res = await axios.post(`${API_BASE}/bookings`, booking)
    return res.data
  }

  return {
    fetchRestaurants,
    fetchRestaurantById,
    loginUser,
    registerUser,
    fetchBookingsForUser,
    createBooking
  }
}