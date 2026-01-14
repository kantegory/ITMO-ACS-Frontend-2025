class WorkoutsApi {
  constructor(instance) {
    this.API = instance
  }

  getAll = async () => {
    return this.API.get('/workouts')
  }

  getById = async (id) => {
    return this.API.get(`/workouts/${id}`)
  }
}

export default WorkoutsApi
