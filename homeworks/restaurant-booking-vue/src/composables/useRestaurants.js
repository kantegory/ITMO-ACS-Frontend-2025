import { ref, onMounted } from 'vue'
import { api } from '../api'

export function useRestaurants() {
  const restaurants = ref([])
  const cuisines = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchRestaurants = async () => {
    loading.value = true
    try {
      const res = await api.getRestaurants()
      restaurants.value = res.data
      cuisines.value = Array.from(new Set(res.data.map(r => r.cuisine)))
      error.value = null
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const getRestaurantById = async (id) => {
    try {
      const res = await api.getRestaurantById(id)
      return res.data
    } catch (err) {
      console.error(err)
      return null
    }
  }

  onMounted(fetchRestaurants)

  return { restaurants, cuisines, loading, error, fetchRestaurants, getRestaurantById }
}
