class JobsApi {
  constructor(instance) {
    this.API = instance
  }

  getCompanies = async () => {
    return this.API({ url: '/companies' })
  }

  getVacancies = async () => {
    return this.API({ url: '/vacancies' })
  }

  getUsers = async () => {
    return this.API({ url: '/users' })
  }

  getProfiles = async (userId = null) => {
    return this.API({
      url: '/profiles',
      params: userId ? { userId } : {},
    })
  }

  createProfile = async (data) => {
    return this.API({
      method: 'POST',
      url: '/profiles',
      data,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  updateProfile = async (id, data) => {
    return this.API({
      method: 'PUT',
      url: `/profiles/${id}`,
      data,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  getEmployers = async (userId) => {
    return this.API({ url: '/employers', params: { userId } })
  }

  createEmployer = async (data) => {
    return this.API({
      method: 'POST',
      url: '/employers',
      data,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  createVacancy = async (data) => {
    return this.API({
      method: 'POST',
      url: '/vacancies',
      data,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  getResponses = async (userId) => {
    return this.API({
      url: '/responses',
      params: userId ? { userId } : {},
    })
  }

  createResponse = async (data) => {
    return this.API({
      method: 'POST',
      url: '/responses',
      data,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  login = async (data) => {
    return this.API({
      method: 'POST',
      url: '/login',
      data,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  register = async (data) => {
    return this.API({
      method: 'POST',
      url: '/register',
      data,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}

export default JobsApi
