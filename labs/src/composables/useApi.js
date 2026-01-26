import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3001'
})

export function useApi() {
  const getRecipes = async (query = '') => {
    const response = await api.get(`/recipes${query}`)
    return response.data
  }

  const getRecipeById = async (id) => {
    // Находим по id (загрузка всего и поиск)
    const recipes = await getRecipes()
    return recipes.find(r => String(r.id) === String(id))
  }

  const addRecipe = async (newRecipe) => {
    const response = await api.post('/recipes', newRecipe)
    return response.data
  }

  const deleteRecipe = async (id) => {
    await api.delete(`/recipes/${id}`)
  }

  const getUsers = async (username, password) => {
    const response = await api.get(`/users?username=${username}&password=${password}`)
    return response.data
  }

  const registerUser = async (user) => {
    const response = await api.post('/users', user)
    return response.data
  }

  return {
    getRecipes,
    getRecipeById,
    addRecipe,
    deleteRecipe,
    getUsers,
    registerUser
  }
}