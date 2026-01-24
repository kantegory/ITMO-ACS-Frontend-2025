<template>
  <div>
    <!-- Hero -->
    <section class="hero-section d-flex align-items-center" aria-labelledby="hero-heading">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <h1 class="display-5 fw-bold mb-3" id="hero-heading">Найдите работу мечты с JobFinder</h1>
            <p class="lead mb-4">
              Поиск вакансий по отрасли, зарплате и опыту. Удобные личные кабинеты для соискателей и работодателей.
            </p>
            <div class="d-flex flex-wrap gap-2">
              <a href="#search-block" class="btn btn-primary btn-lg">Найти вакансии</a>
              <router-link to="/dashboard/employer" class="btn btn-outline-light btn-lg">Разместить вакансию</router-link>
            </div>
          </div>
          <div class="col-lg-5 offset-lg-1 d-none d-lg-block">
            <div class="hero-card p-4 rounded-4 shadow-lg bg-white">
              <h2 class="h5 mb-3">Быстрый поиск</h2>
              <form @submit.prevent="handleHeroSearch" aria-label="Форма быстрого поиска вакансий">
                <div class="mb-3">
                  <label for="heroKeyword" class="form-label">Ключевое слово</label>
                  <input
                    type="text"
                    id="heroKeyword"
                    v-model="heroSearch.keyword"
                    class="form-control"
                    placeholder="Должность, компания..."
                  >
                </div>
                <div class="mb-3">
                  <label for="heroLocation" class="form-label">Город</label>
                  <input
                    type="text"
                    id="heroLocation"
                    v-model="heroSearch.location"
                    class="form-control"
                    placeholder="Москва, Санкт-Петербург..."
                  >
                </div>
                <button type="submit" class="btn btn-primary w-100">Искать</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Search & Filters -->
    <main id="search-block" class="py-5 bg-light border-top">
      <div class="container">
        <div class="row g-4">
          <aside class="col-lg-3" aria-label="Фильтры поиска">
            <JobFilters v-model="filters" />
          </aside>

          <div class="col-lg-9">
            <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
              <JobSearch @search="handleSearch" />
              <div class="text-muted" role="status" aria-live="polite" aria-atomic="true">
                Найдено: {{ filteredJobs.length }} {{ getJobsWord(filteredJobs.length) }}
              </div>
            </div>

            <section aria-label="Список вакансий">
              <div v-if="loading" class="list-group">
                <div class="list-group-item text-center text-muted">
                  <div class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true">
                    <span class="visually-hidden">Загрузка...</span>
                  </div>
                  <span aria-live="polite">Загрузка вакансий...</span>
                </div>
              </div>
              <div v-else-if="error" class="list-group">
                <div class="list-group-item text-center">
                  <div class="alert alert-danger mb-0" role="alert">
                    <strong>Ошибка загрузки вакансий</strong><br>
                    <small>{{ error }}</small>
                  </div>
                </div>
              </div>
              <div v-else-if="filteredJobs.length === 0" class="list-group">
                <div class="list-group-item text-center text-muted">Вакансии не найдены</div>
              </div>
              <div v-else class="list-group" role="list">
                <JobCard v-for="job in filteredJobs" :key="job.id" :job="job" role="listitem" />
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useJobs } from '@/composables/useJobs'
import JobCard from '@/components/JobCard.vue'
import JobFilters from '@/components/JobFilters.vue'
import JobSearch from '@/components/JobSearch.vue'

const { jobs, loading, error, getAll } = useJobs()

const filters = ref({
  industry: '',
  experience: '',
  salary: 0
})

const searchKeyword = ref('')

const filteredJobs = computed(() => {
  let result = [...jobs.value]

  if (filters.value.industry) {
    result = result.filter(job => job.industry === filters.value.industry)
  }

  if (filters.value.experience) {
    result = result.filter(job => job.experience === filters.value.experience)
  }

  if (filters.value.salary > 0) {
    result = result.filter(job => job.salary >= filters.value.salary)
  }

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(job => {
      const text = `${job.title} ${job.company} ${job.location}`.toLowerCase()
      return text.includes(keyword)
    })
  }

  return result
})

const getJobsWord = (count) => {
  if (count === 1) return 'вакансия'
  if (count > 1 && count < 5) return 'вакансии'
  return 'вакансий'
}

const handleSearch = (keyword) => {
  searchKeyword.value = keyword
}

const handleHeroSearch = () => {
  if (heroSearch.value.keyword) {
    searchKeyword.value = heroSearch.value.keyword
    const target = document.getElementById('search-block')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

const heroSearch = ref({
  keyword: '',
  location: ''
})


onMounted(async () => {
  try {
    await getAll()
  } catch (err) {
    console.error('Ошибка загрузки вакансий:', err)
  }
})
</script>

