class RentalsApi {
  constructor(instance) {
    this.API = instance
  }

  getUserRentals(userId) {
    return this.API.get(`/rentals?userId=${userId}`)
  }

  rentHouse(data) {
    return this.API.post('/rentals', data)
  }
}

export default RentalsApi
