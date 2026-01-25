class UserApi {
  constructor(instance) {
    this.API = instance
  }

  getUser = async (userId) => {
    return this.API.get(`/users/${userId}`)
  }

  getBookings = async (userId) => {
    return this.API.get('/bookings', { params: { userId } })
  }

  updateProfile = async (userId, data) => {
    return this.API.patch(`/users/${userId}`, data)
  }

  changePassword = async (userId, newPassword) => {
    return this.API.patch(`/users/${userId}`, { password: newPassword })
  }
}

export default UserApi
