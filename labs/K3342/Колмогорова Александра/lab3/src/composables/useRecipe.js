import { ref } from 'vue'

export default function useRecipe() {
  const recipe = ref(null)
  const error = ref(null)
  const loading = ref(false)

  const loadRecipeById = async (id) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await fetch(`http://localhost:3000/publicRecipes/${id}`)
      
      if (!response.ok) {
        throw new Error('Рецепт не найден')
      }
      
      const data = await response.json()
      
      recipe.value = Array.isArray(data) ? data[0] : data
      
    } catch (e) {
      console.error('Ошибка загрузки рецепта:', e)
      error.value = 'Ошибка загрузки рецепта'
      recipe.value = null
    } finally {
      loading.value = false
    }
  }

  return {
    recipe,
    error,
    loading,
    loadRecipeById
  }
}