import api from './api'

export const restaurantService = {
  getAll() {
    return api.get('/restaurants')
  },

  getById(id) {
    return api.get(`/restaurants/${id}`)
  },

  search(params) {
    return api.get('/restaurants', { params })
  }
}
