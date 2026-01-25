class AuthApi {
  constructor(instance) {
    this.API = instance
  }

  getUsers = async () => {
    return this.API.get('/users')
  }

  createUser = async (data) => {
    return this.API.post(`/users`, data)
  }

  updatePassword = async (userId, newPassword) => {
    return this.API.patch(`/users/${userId}`, { password: newPassword })
  }
}

export default AuthApi
