class AdvertisementsApi {
  constructor(instance) {
    this.API = instance
  }

  getAll = async (params) => {
    return this.API({
      url: '/advertisements',
      params
    })
  }

  getById = async (id) => {
    return this.API({
      url: `/advertisements/${id}`
    })
  }

  create = async (data) => {
    return this.API({
      method: 'POST',
      url: '/advertisements',
      data,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  update = async (id, data) => {
    return this.API({
      method: 'PUT',
      url: `/advertisements/${id}`,
      data,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  delete = async (id) => {
    return this.API({
      method: 'DELETE',
      url: `/advertisements/${id}`
    })
  }

  me(params = {}) {
    return this.API.get("/advertisements/me", { params });
  }
}

export default AdvertisementsApi
