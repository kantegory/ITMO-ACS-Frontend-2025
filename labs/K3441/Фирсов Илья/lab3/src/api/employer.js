export default (api) => ({
  getEmployerVacancies: () => api.get('/employerVacancies'),
  createEmployerVacancy: (data) => api.post('/employerVacancies', data),
  updateEmployerVacancy: (id, data) => api.patch(`/employerVacancies/${id}`, data),
})
