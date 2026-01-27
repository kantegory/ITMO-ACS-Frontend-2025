import { computed, reactive } from 'vue'
import { useJobsStore } from '@/stores/jobs'
import { experienceLabel, formatLabel } from '@/utils/labels'
import { INDUSTRY_LABELS } from '@/constants/industries'

const FILTERS_KEY = 'jobFilters'

const defaultFilters = () => ({
  industry: '',
  salary: 0,
  experience: '',
  format: '',
  keyword: '',
})

export const useVacancyFilters = () => {
  const store = useJobsStore()
  const saved = JSON.parse(localStorage.getItem(FILTERS_KEY) || 'null')
  const filters = reactive({ ...defaultFilters(), ...(saved || {}) })

  const save = () => {
    localStorage.setItem(FILTERS_KEY, JSON.stringify(filters))
  }

  const reset = () => {
    Object.assign(filters, defaultFilters())
    save()
  }

  const applyQuickSearch = (keyword, city) => {
    filters.keyword = keyword?.trim().toLowerCase() || ''
    if (city) {
      filters.keyword = `${filters.keyword} ${city}`.trim()
    }
    save()
  }

  const matches = (vacancy) => {
    const salaryOk =
      !filters.salary ||
      (vacancy.salaryMax || vacancy.salaryMin || 0) >= filters.salary
    const industryOk =
      !filters.industry || vacancy.industry === filters.industry
    const experienceOk =
      !filters.experience || vacancy.experienceBucket === filters.experience
    const formatOk = !filters.format || vacancy.format === filters.format
    const text = `${vacancy.title} ${vacancy.company?.name || ''} ${vacancy.description || ''} ${vacancy.location || ''}`
      .toLowerCase()
      .trim()
    const keyword = filters.keyword ? filters.keyword.toLowerCase() : ''
    const keywordOk = keyword ? text.includes(keyword) : true
    return salaryOk && industryOk && experienceOk && formatOk && keywordOk
  }

  const filteredVacancies = computed(() =>
    store.normalizedVacancies.filter(matches),
  )

  const activeFilters = computed(() => {
    const items = []
    if (filters.industry) {
      items.push(INDUSTRY_LABELS[filters.industry] || filters.industry)
    }
    if (filters.salary) {
      items.push(`от ${filters.salary.toLocaleString('ru-RU')} ₽`)
    }
    if (filters.experience) {
      items.push(experienceLabel(filters.experience))
    }
    if (filters.format) {
      items.push(formatLabel(filters.format))
    }
    if (filters.keyword) {
      items.push(`Поиск: ${filters.keyword}`)
    }
    return items
  })

  return {
    filters,
    filteredVacancies,
    activeFilters,
    applyQuickSearch,
    reset,
    save,
  }
}
