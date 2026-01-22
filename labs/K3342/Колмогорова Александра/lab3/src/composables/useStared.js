import { ref } from 'vue'
import { recipesApi } from '@/api/recipes'

export default function useStared() {
  const staredRecipes = ref([])
  const loading = ref(false)
  const error = ref(null)

  const loadStared = async (userId) => {
    if (!userId) return
    try {
      loading.value = true
      const res = await recipesApi.getStared(userId)
      staredRecipes.value = res.data
    } 
    catch (e) {
      console.error(e)
    }
  }

  const addStared = async (userId, recipe) => {
    try {
      loading.value = true
      await recipesApi.addStared(userId, recipe)
      if (!staredRecipes.value.some(r => r.id === recipe.id)) {
        staredRecipes.value.push(recipe)
      }
    } 
    catch (e) {
      console.error(e)
    }
  }

  const removeStared = async (userId, recipeId) => {
    try {
      loading.value = true
      await recipesApi.removeStared(userId, recipeId)
      staredRecipes.value = staredRecipes.value.filter(r => r.id !== recipeId)
    } 
    catch (e) {
      console.error(e)
    } 
  }

  const isStared = (recipeId) => {
    return staredRecipes.value.some(r => r.id === recipeId)
  }

  return {
    staredRecipes,
    loading,
    error,
    loadStared,
    addStared,
    removeStared,
    isStared
  }
}