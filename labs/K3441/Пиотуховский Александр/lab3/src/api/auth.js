import apiInstance from './instance'

export const login = (email, password) => {
  return apiInstance.post('/auth/login', {email, password})
}

export const register = (userData) => {
  return apiInstance.post('/auth/register', userData)
}
