import { ref } from 'vue'
import { useApi } from './useApi'

export function useResumes() {
  const { apiClient } = useApi()
  
  const resume = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const getByUserId = async (userId) => {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.get('/resumes')
      const resumes = response.data
      resume.value = resumes.find(r => r.userId === userId) || null
      return resume.value
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const update = async (id, resumeData) => {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.patch(`/resumes/${id}`, resumeData)
      resume.value = response.data
      return resume.value
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const create = async (resumeData) => {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.post('/resumes', resumeData)
      resume.value = response.data
      return resume.value
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    resume,
    loading,
    error,
    getByUserId,
    update,
    create
  }
}

