import { ref } from 'vue'
import api from '@/api/axios'

export function useRecipes() {
  const recipes = ref([])
  const loading = ref(false)

  const search = ref('')
  const type = ref('')
  const difficulty = ref('')

  const loadRecipes = async () => {
    try {
      loading.value = true

      const params = {}

      if (search.value) {
        params.title = search.value
      }

      if (type.value) {
        params.type = type.value
      }

      if (difficulty.value) {
        params.difficulty = difficulty.value
      }

      const response = await api.get('/recipes', { params })
      recipes.value = response.data
    } catch (error) {
      console.error('Ошибка загрузки рецептов', error)
    } finally {
      loading.value = false
    }
  }

  const resetFilters = () => {
    search.value = ''
    type.value = ''
    difficulty.value = ''
    loadRecipes()
  }

  return {
    recipes,
    loading,
    search,
    type,
    difficulty,
    loadRecipes,
    resetFilters
  }
}
