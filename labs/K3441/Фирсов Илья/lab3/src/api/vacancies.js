export default (api) => ({
  getVacancies: (filters = {}) => {
    const params = new URLSearchParams()
    
    // Фильтр по статусу (только опубликованные)
    params.append('status', 'опубликована')
    
    // Фильтр по отрасли
    if (filters.industry) {
      params.append('industry', filters.industry)
    }
    
    // Фильтр по уровню опыта
    if (filters.experience) {
      params.append('level', filters.experience)
    }
    
    // Фильтр по минимальной зарплате
    if (filters.salary && filters.salary > 0) {
      params.append('salaryFrom_gte', filters.salary)
    }
    
    // Фильтр по ключевым словам (будет обрабатываться на бэкенде)
    if (filters.keyword) {
      params.append('q', filters.keyword)
    }
    
    return api.get(`/vacancies?${params.toString()}`)
  },
  createVacancy: (data) => api.post('/vacancies', data),
  updateVacancy: (id, data) => api.patch(`/vacancies/${id}`, data),
})
