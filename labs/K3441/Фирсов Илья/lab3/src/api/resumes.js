export default (api) => ({
  getResumes: () => api.get('/resumes'),
  createResume: (data) => api.post('/resumes', data),
  updateResume: (id, data) => api.put(`/resumes/${id}`, data),
})
