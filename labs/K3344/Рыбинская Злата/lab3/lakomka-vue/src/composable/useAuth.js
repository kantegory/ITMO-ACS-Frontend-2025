import { ref } from 'vue'
import api from '@/api/axios'

export function useRecipes() {
  const recipes = ref([])
  const loading = ref(false)

  const loadRecipesByAuthor = async (authorId) => {
    try {
      loading.value = true
      const response = await api.get('/recipes', {
        params: { author: authorId }
      })
      recipes.value = response.data
    } catch (e) {
      console.error('Ошибка загрузки рецептов пользователя', e)
    } finally {
      loading.value = false
    }
  }

  return {
    recipes,
    loading,
    loadRecipesByAuthor
  }
}
