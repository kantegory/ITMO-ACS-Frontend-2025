import { ref, onMounted } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:3000/recipes'

export function useRecipes() {
  const recipes = ref([])
  const loading = ref(false)
  const error = ref(null)

  const loadRecipes = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.get(API_URL)
      recipes.value = response.data
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  onMounted(loadRecipes)

  return {
    recipes,
    loading,
    error,
    loadRecipes
  }
}
