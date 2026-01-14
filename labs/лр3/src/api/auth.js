class AuthApi {
  constructor(instance) {
    this.API = instance
  }

  login = async (email, password) => {
    return this.API.post('/login', { email, password })
  }

  register = async (userData) => {
    return this.API.post('/users', userData)
  }

  checkEmail = async (email) => {
    return this.API.get(`/users?email=${encodeURIComponent(email)}`)
  }
}

export default AuthApi
