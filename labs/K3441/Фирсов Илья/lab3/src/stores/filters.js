import { defineStore } from 'pinia'
import { useJobsStore } from './jobs'

const FILTERS_KEY = 'jobFilters'

const defaults = () => ({
  keyword: '',
  industry: '',
  experience: '',
  salary: 0,
})

export const useFiltersStore = defineStore('filters', {
  state: () => {
    const saved = JSON.parse(localStorage.getItem(FILTERS_KEY) || 'null')
    return {
      keyword: saved?.keyword || '',
      industry: saved?.industry || '',
      experience: saved?.experience || '',
      salary: saved?.salary || 0,
    }
  },

  getters: {
    filteredVacancies() {
      const jobsStore = useJobsStore()
      // Возвращаем вакансии из store (уже отфильтрованные на бэкенде)
      return jobsStore.normalizedVacancies || []
    },
  },

  actions: {
    async applyFilters() {
      const jobsStore = useJobsStore()
      const filters = {
        keyword: this.keyword,
        industry: this.industry,
        experience: this.experience,
        salary: this.salary,
      }
      await jobsStore.loadVacancies(filters)
      this.save()
    },

    save() {
      localStorage.setItem(
        FILTERS_KEY,
        JSON.stringify({
          keyword: this.keyword,
          industry: this.industry,
          experience: this.experience,
          salary: this.salary,
        })
      )
    },

    reset() {
      const defaultValues = defaults()
      this.keyword = defaultValues.keyword
      this.industry = defaultValues.industry
      this.experience = defaultValues.experience
      this.salary = defaultValues.salary
      this.save()
      this.applyFilters()
    },
  },
})
