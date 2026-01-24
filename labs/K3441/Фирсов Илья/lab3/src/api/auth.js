export default (api) => ({
  login: (data) => api.post('/login', data),
  register: (data) => api.post('/register', data),
  getUser: (id) => api.get(`/users/${id}`),
})
