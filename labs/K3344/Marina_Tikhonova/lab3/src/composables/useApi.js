import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000'

// Создание экземпляра axios с базовой конфигурацией
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Интерцептор для добавления токена к каждому запросу
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

export function useApi() {
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      if (response.data.token && response.data.user) {
        localStorage.setItem('token', response.data.token)
        return response.data
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка входа')
    }
  }

  const register = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password })
      if (response.data.token && response.data.user) {
        localStorage.setItem('token', response.data.token)
        return response.data
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка регистрации')
    }
  }

  const getCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No token found')
      
      const response = await api.get('/users/me')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка получения данных пользователя')
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
  }

  const getRecipes = async () => {
    try {
      const response = await api.get('/recipes')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка загрузки рецептов')
    }
  }

  const getRecipeById = async (id) => {
    try {
      const response = await api.get(`/recipes/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка загрузки рецепта')
    }
  }

  const getCommentsByRecipeId = async (recipeId) => {
    try {
      const response = await api.get(`/comments?recipeId=${recipeId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка загрузки комментариев')
    }
  }

  const addComment = async (recipeId, text) => {
    try {
      const user = await getCurrentUser()
      await api.post('/comments', {
        recipeId,
        text,
        author: user.name,
        date: new Date().toISOString()
      })
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка добавления комментария')
    }
  }

  const toggleLike = async (recipeId) => {
    try {
      await api.patch(`/recipes/${recipeId}/like`)
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка лайка')
    }
  }

  const saveRecipe = async (userId, recipeId) => {
    try {
      await api.post(`/users/${userId}/saved`, { recipeId })
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка сохранения')
    }
  }

  const getUserSavedRecipes = async (userId) => {
    try {
      const response = await api.get(`/saved_recipes?userId=${userId}`)
      const savedIds = response.data.map(item => item.recipeId)
      const recipesResponse = await api.get('/recipes')
      return recipesResponse.data.filter(recipe => savedIds.includes(recipe.id))
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка загрузки сохраненных рецептов')
    }
  }

  const getUserPublishedRecipes = async (userId) => {
    try {
      const response = await api.get(`/recipes?authorId=${userId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка загрузки опубликованных рецептов')
    }
  }

  const publishRecipe = async (recipeData) => {
    try {
      const user = await getCurrentUser()
      const fullRecipeData = {
        ...recipeData,
        authorId: user.id,
        likes: 0,
        dateCreated: new Date().toISOString()
      }
      await api.post('/recipes', fullRecipeData)
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка публикации рецепта')
    }
  }

  return {
    login,
    register,
    getCurrentUser,
    logout,
    getRecipes,
    getRecipeById,
    getCommentsByRecipeId,
    addComment,
    toggleLike,
    saveRecipe,
    getUserSavedRecipes,
    getUserPublishedRecipes,
    publishRecipe
  }
}