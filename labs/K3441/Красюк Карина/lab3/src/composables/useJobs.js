import { ref } from 'vue'
import { useApi } from './useApi'
import { useAuth } from './useAuth'

export function useJobs() {
  const { apiClient } = useApi()
  const { getCurrentUser } = useAuth()
  
  const jobs = ref([])
  const job = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const getAll = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.get('/jobs')
      jobs.value = response.data
      return jobs.value
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getById = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.get(`/jobs/${id}`)
      job.value = response.data
      return job.value
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const create = async (jobData) => {
    loading.value = true
    error.value = null
    try {
      const user = getCurrentUser()
      const response = await apiClient.post('/jobs', {
        ...jobData,
        employerId: user.id,
        status: 'active',
        publishedAt: new Date().toISOString().split('T')[0],
        applicationsCount: 0
      })
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const update = async (id, jobData) => {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.patch(`/jobs/${id}`, jobData)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteJob = async (id) => {
    loading.value = true
    error.value = null
    try {
      await apiClient.delete(`/jobs/${id}`)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    jobs,
    job,
    loading,
    error,
    getAll,
    getById,
    create,
    update,
    delete: deleteJob
  }
}

