import api from './instance'

export const recipesApi = {
  getAll() {
    return api.get('/publicRecipes')
  },

  filterByType(type) {
    return api.get('/publicRecipes', {
      params: { type }
    })
  },

  filterByDifficulty(difficulty) {
    return api.get('/publicRecipes', {
      params: { difficulty }
    })
  },

  search(query) {
    return api.get('/publicRecipes', {
      params: { title_like: query }
    })
  },

  getById(id) {
    return api.get(`/publicRecipes/${id}`)
  },

  async getStared(userId) {
    const resUser = await api.get(`/users/${userId}`)
    const recipeIds = resUser.data.stared || []

    const resRecipes = await api.get('/publicRecipes')
    const recipes = resRecipes.data.filter(r => recipeIds.includes(r.id))

    return { data: recipes }
  },

  async addStared(userId, recipe) {
    const resUser = await api.get(`/users/${userId}`)
    const stared = resUser.data.stared || []

    if (!stared.includes(recipe.id)) {
      stared.push(recipe.id)
    }

    await api.patch(`/users/${userId}`, { stared })
    return { data: recipe }
  },

  async removeStared(userId, recipeId) {
    const resUser = await api.get(`/users/${userId}`)
    const stared = resUser.data.stared || []

    const newStared = stared.filter(id => id != recipeId)

    await api.patch(`/users/${userId}`, { stared: newStared })
  }
}
