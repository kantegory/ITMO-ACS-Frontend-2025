import { ref } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:3000'

export function useApi() {
  const loading = ref(false)
  const error = ref(null)

  const get = async (endpoint) => {
    try {
      loading.value = true
      const response = await axios.get(`${API_URL}${endpoint}`)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const post = async (endpoint, data) => {
    try {
      loading.value = true
      const response = await axios.post(`${API_URL}${endpoint}`, data)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    get,
    post
  }
}