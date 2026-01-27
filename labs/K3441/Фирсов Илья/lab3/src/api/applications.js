export default (api) => ({
  getApplications: () => api.get('/applications'),
  createApplication: (data) => api.post('/applications', data),
  updateApplication: (id, data) => api.patch(`/applications/${id}`, data),
})
