import { ref } from 'vue'
import { useApi } from './useApi'
import { useAuth } from './useAuth'

export function useApplications() {
  const { apiClient } = useApi()
  const { getCurrentUser } = useAuth()
  
  const applications = ref([])
  const loading = ref(false)
  const error = ref(null)

  const getByUserId = async (userId) => {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.get('/applications')
      const allApplications = response.data
      applications.value = allApplications.filter(a => a.userId === userId)
      return applications.value
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getByJobId = async (jobId) => {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.get('/applications')
      const allApplications = response.data
      applications.value = allApplications.filter(a => a.jobId === jobId)
      return applications.value
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const create = async (jobId) => {
    loading.value = true
    error.value = null
    try {
      const user = getCurrentUser()
      const response = await apiClient.post('/applications', {
        jobId,
        userId: user.id,
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0]
      })

      // Увеличиваем счётчик откликов у вакансии
      try {
        const jobResponse = await apiClient.get(`/jobs/${jobId}`)
        const job = jobResponse.data
        await apiClient.patch(`/jobs/${jobId}`, {
          applicationsCount: (job.applicationsCount || 0) + 1
        })
      } catch (err) {
        console.error('Ошибка обновления счётчика откликов:', err)
      }

      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const update = async (id, status) => {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.patch(`/applications/${id}`, { status })
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    applications,
    loading,
    error,
    getByUserId,
    getByJobId,
    create,
    update
  }
}

