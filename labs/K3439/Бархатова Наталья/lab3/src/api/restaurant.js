class RestaurantsApi {
  constructor(instance) {
    this.API = instance
  }

  getRestaurants = async (filters = {}) => {
    return this.API.get('/restaurants', { params: filters })
  }

  getRestaurant = async (id) => {
    return this.API.get(`/restaurants/${id}`)
  }

  getReviews = async (restaurantId) => {
    const response = await this.API.get(`/restaurants/${restaurantId}`)
    return { data: response.data.reviews || [] }
  }
}

export default RestaurantsApi
