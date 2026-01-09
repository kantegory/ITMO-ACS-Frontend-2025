import apiInstance from './instance'

export const getRecipes = (filters = {}) => {
  const params = {}

  if (filters.authorId) {
    params.authorId = filters.authorId
  }

  if (filters.title) {
    params.title = filters.title
  }

  if (filters.dishtype) {
    params.dishtype = filters.dishtype
  }

  if (filters.difficulty) {
    params.difficulty = filters.difficulty
  }

  if (filters.ingredients && filters.ingredients.length > 0) {
    params.ingredients = filters.ingredients
  }

  return apiInstance.get('/recipe', {params})
}

export const getRecipe = (id) => {
  return apiInstance.get(`/recipe/${id}`)
}

export const createRecipe = (recipeData) => {
  return apiInstance.post('/recipe', recipeData)
}

export const updateRecipe = (id, recipeData) => {
  return apiInstance.put(`/recipe/${id}`, recipeData)
}

export const deleteRecipe = (id) => {
  return apiInstance.delete(`/recipe/${id}`)
}

export const addRecipeToFavorites = (recipeId, userId) => {
  return apiInstance.post(`/recipe/${recipeId}/favorite`, {userId})
}

export const removeRecipeFromFavorites = (recipeId, userId) => {
  return apiInstance.delete(`/recipe/${recipeId}/favorite`, {
    data: {userId}
  })
}
