import { ref, computed } from 'vue'
import { useApi } from './useApi'

export const useListings = () => {
  const api = useApi()
  const listings = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchListings = async (filters = {}) => {
    loading.value = true
    error.value = null
    try {
      let endpoint = '/listings'
      const params = new URLSearchParams()
      
      if (filters.type && filters.type !== 'any') {
        params.append('type', filters.type)
      }
      if (filters.maxPrice) {
        params.append('price_lte', filters.maxPrice)
      }
      if (filters.location) {
        params.append('location', filters.location)
      }

      if (params.toString()) {
        endpoint += `?${params.toString()}`
      }

      let result = await api.get(endpoint)
      
      if (filters.location && Array.isArray(result)) {
        const locationLower = filters.location.toLowerCase()
        result = result.filter(l => 
          l.location && l.location.toLowerCase().includes(locationLower)
        )
      }

      listings.value = result
    } catch (err) {
      error.value = err.message
      listings.value = []
    } finally {
      loading.value = false
    }
  }

  const getListingById = async (id) => {
    try {
      return await api.get(`/listings/${id}`)
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const filteredCount = computed(() => listings.value.length)

  return {
    listings,
    loading,
    error,
    filteredCount,
    fetchListings,
    getListingById
  }
}

