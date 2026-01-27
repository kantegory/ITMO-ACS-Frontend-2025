class RecipesApi {
  constructor(instance) {
    this.API = instance
  }

  getAll = async () => {
    return this.API({
      url: '/recipes'
    })
  }

  getOne = async (id) => {
    return this.API({
      url: `/recipes/${id}`
    })
  }

  createRecipe = async (data) => {
    return this.API({
      method: 'POST',
      url: '/recipes',
      data,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  updateRecipe = async (id, data) => {
    return this.API({
      method: 'PUT',
      url: `/recipes/${id}`,
      data,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  deleteRecipe = async (id) => {
    return this.API({
      method: 'DELETE',
      url: `/recipes/${id}`
    })
  }
}

export default RecipesApi
