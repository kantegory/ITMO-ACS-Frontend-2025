import { ref } from 'vue'
import { recipesApi } from '@/api/recipes'

export default function useRecipesFilters() {
  const recipes = ref([])
  const loading = ref(false)
  const error = ref(null)

  const loadAll = async () => {
    try {
      loading.value = true
      const res = await recipesApi.getAll()
      recipes.value = res.data
    } catch (e) {
      error.value = 'Ошибка загрузки рецептов'
    } finally {
      loading.value = false
    }
  }

  const filterByType = async (type) => {
    try {
      loading.value = true
      const res = await recipesApi.filterByType(type)
      recipes.value = res.data
    } catch (e) {
      error.value = 'Ошибка фильтрации'
    } finally {
      loading.value = false
    }
  }

  const filterByDifficulty = async (difficulty) => {
    try {
      loading.value = true
      const res = await recipesApi.filterByDifficulty(difficulty)
      recipes.value = res.data
    } catch (e) {
      error.value = 'Ошибка фильтрации'
    } finally {
      loading.value = false
    }
  }

  const search = async (query) => {
    try {
      loading.value = true
      const res = await recipesApi.search(query)
      recipes.value = res.data
    } catch (e) {
      error.value = 'Ошибка поиска'
    } finally {
      loading.value = false
    }
  }

  return {
    recipes,
    loading,
    error,
    loadAll,
    filterByType,
    filterByDifficulty,
    search
  }
}
