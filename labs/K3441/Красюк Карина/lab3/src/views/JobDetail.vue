<template>
  <main class="container pb-5" style="margin-top: 5rem;">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Загрузка...</span>
      </div>
    </div>
    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>
    <div v-else-if="job" class="row g-4">
      <article class="col-lg-8">
        <section class="card shadow-sm mb-3" aria-labelledby="job-title">
          <div class="card-body">
            <header class="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h1 class="h3 mb-1" id="job-title">{{ job.title }}</h1>
                <div class="text-muted mb-2">
                  <span class="icon icon-sm me-1">
                    <svg><use href="#icon-building"></use></svg>
                  </span>
                  {{ job.company }} • 
                  <span class="icon icon-sm me-1">
                    <svg><use href="#icon-location"></use></svg>
                  </span>
                  {{ job.location }} • {{ job.employmentType }}
                </div>
                <div class="d-flex flex-wrap gap-2 job-header-badge">
                  <span class="badge text-bg-primary">{{ industryLabels[job.industry] || job.industry }}</span>
                  <span class="badge text-bg-secondary">{{ expLabels[job.experience] || job.experience }}</span>
                </div>
              </div>
              <div class="text-end">
                <div class="h4 mb-1">от {{ formatSalary(job.salary) }} ₽</div>
                <small class="text-muted">Опубликовано: {{ formatDate(job.publishedAt) }}</small>
              </div>
            </header>

            <h2 class="h5 mt-4 mb-2">Описание</h2>
            <p>{{ job.description }}</p>

            <h2 v-if="job.responsibilities && job.responsibilities.length > 0" class="h5 mt-4 mb-2">Обязанности</h2>
            <ul v-if="job.responsibilities && job.responsibilities.length > 0">
              <li v-for="(resp, index) in job.responsibilities" :key="index">{{ resp }}</li>
            </ul>

            <h2 v-if="job.requirements && job.requirements.length > 0" class="h5 mt-4 mb-2">Требования</h2>
            <ul v-if="job.requirements && job.requirements.length > 0">
              <li v-for="(req, index) in job.requirements" :key="index">{{ req }}</li>
            </ul>

            <h2 v-if="job.conditions && job.conditions.length > 0" class="h5 mt-4 mb-2">Условия</h2>
            <ul v-if="job.conditions && job.conditions.length > 0">
              <li v-for="(cond, index) in job.conditions" :key="index">{{ cond }}</li>
            </ul>
          </div>
        </section>

        <nav aria-label="Навигация">
          <router-link to="/" class="btn btn-outline-secondary btn-sm">&larr; Назад к списку вакансий</router-link>
        </nav>
      </article>

      <aside class="col-lg-4" aria-label="Дополнительная информация">
        <section class="card shadow-sm mb-3">
          <div class="card-body">
            <h2 class="h6 card-title mb-3">Отклик на вакансию</h2>
            <button
              v-if="isAuthenticated && isCandidate"
              class="btn btn-primary w-100 mb-2"
              @click="handleApply"
              :disabled="applying"
            >
              {{ applying ? 'Отправка...' : 'Откликнуться' }}
            </button>
            <div v-else>
              <p class="small text-muted mb-2">
                Чтобы откликнуться, войдите в личный кабинет соискателя или зарегистрируйтесь.
              </p>
              <div class="d-flex gap-2">
                <router-link to="/login" class="btn btn-primary flex-grow-1">Войти</router-link>
                <router-link to="/register" class="btn btn-outline-secondary flex-grow-1">Регистрация</router-link>
              </div>
            </div>
          </div>
        </section>
      </aside>
    </div>
  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useJobs } from '@/composables/useJobs'
import { useAuth } from '@/composables/useAuth'
import { useApplications } from '@/composables/useApplications'
import { useNotifications } from '@/composables/useNotifications'

const route = useRoute()
const { job, loading, error, getById } = useJobs()
const { isAuthenticated, isCandidate } = useAuth()
const { create, loading: applying } = useApplications()
const { success, error: showError } = useNotifications()

const industryLabels = {
  it: 'IT',
  marketing: 'Маркетинг',
  finance: 'Финансы',
  sales: 'Продажи'
}

const expLabels = {
  junior: '0–1 год',
  middle: '1–3 года',
  senior: '3+ года'
}

const formatSalary = (salary) => {
  return salary.toLocaleString('ru-RU')
}

const formatDate = (dateString) => {
  const publishedDate = new Date(dateString)
  const today = new Date()
  const diffDays = Math.floor((today - publishedDate) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'сегодня'
  if (diffDays === 1) return 'вчера'
  if (diffDays > 1) return `${diffDays} дня назад`
  return dateString
}

const handleApply = async () => {
  try {
    await create(job.value.id)
    success('Отклик успешно отправлен!')
  } catch (err) {
    showError(err.message || 'Ошибка отправки отклика')
  }
}

onMounted(async () => {
  const jobId = route.params.id
  if (jobId) {
    try {
      await getById(jobId)
    } catch (err) {
      console.error('Ошибка загрузки вакансии:', err)
    }
  }
})
</script>

