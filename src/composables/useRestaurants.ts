import { ref } from 'vue'
import { restaurantsAPI } from '@/api'
import type { Restaurant, SearchFilters } from '@/types'

export function useRestaurants() {
  const restaurants = ref<Restaurant[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchRestaurants = async (filters?: SearchFilters) => {
    loading.value = true
    error.value = null
    try {
      if (filters && (filters.cuisine || filters.location || filters.price)) {
        restaurants.value = await restaurantsAPI.search(filters)
      } else {
        restaurants.value = await restaurantsAPI.getAll()
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка загрузки ресторанов'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const fetchRestaurantById = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      return await restaurantsAPI.getById(id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка загрузки ресторана'
      console.error(err)
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    restaurants,
    loading,
    error,
    fetchRestaurants,
    fetchRestaurantById
  }
}

