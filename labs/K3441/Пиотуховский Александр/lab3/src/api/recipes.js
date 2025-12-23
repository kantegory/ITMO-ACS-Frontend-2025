import apiInstance from './instance'

export const getRecipes = (authorId) => {
  return apiInstance.get('/recipe', {
    params: authorId ? {authorId} : {}
  })
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
