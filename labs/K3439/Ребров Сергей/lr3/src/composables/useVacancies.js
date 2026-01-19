import { ref } from 'vue'
import useApi from './useApi'

export default function useVacancies() {
  const { api } = useApi()
  const vacancies = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function loadVacancies({ search = '' } = {}) {
    loading.value = true
    error.value = null
    try {
      const q = search ? `?q=${encodeURIComponent(search)}` : ''
      const res = await api.get(`/vacancies${q}`)
      vacancies.value = res.data || []
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  async function getVacancy(id) {
    const res = await api.get(`/vacancies/${id}`)
    return res.data
  }

  async function createVacancy(payload) {
    const res = await api.post('/vacancies', payload)
    return res.data
  }

  async function deleteVacancy(id) {
    const res = await api.delete(`/vacancies/${id}`)
    return res.data
  }

  return { vacancies, loading, error, loadVacancies, getVacancy, createVacancy, deleteVacancy }
}