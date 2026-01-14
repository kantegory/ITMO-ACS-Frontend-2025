<template>
  <div>
    <header class="dashboard-header py-4 mb-4 mt-5">
      <div class="container d-flex flex-wrap align-items-center gap-3">
        <div class="avatar-circle me-2" aria-hidden="true">
          <span>{{ getUserInitials(user?.companyName) }}</span>
        </div>
        <div>
          <h1 class="h4 mb-1">{{ user?.companyName }}</h1>
          <div class="small">{{ user?.industry || '' }} • {{ user?.city || '' }}</div>
        </div>
        <nav class="ms-auto d-flex flex-wrap gap-2" aria-label="Действия в личном кабинете">
          <button
            class="btn btn-light btn-sm"
            @click="showNewVacancyModal = true"
            aria-label="Разместить новую вакансию"
          >
            Разместить вакансию
          </button>
        </nav>
      </div>
    </header>

    <main class="container pb-5">
      <div class="row g-4">
        <div class="col-lg-8">
          <section class="card shadow-sm mb-4" aria-labelledby="my-vacancies-heading">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h2 class="h5 card-title mb-0" id="my-vacancies-heading">Мои вакансии</h2>
                <button
                  class="btn btn-outline-primary btn-sm"
                  @click="showNewVacancyModal = true"
                  aria-label="Создать новую вакансию"
                >
                  + Новая вакансия
                </button>
              </div>

              <div v-if="loading" class="text-center py-3">
                <div class="spinner-border spinner-border-sm" role="status">
                  <span class="visually-hidden">Загрузка...</span>
                </div>
              </div>
              <div v-else-if="myJobs.length === 0" class="text-muted text-center py-3">
                У вас пока нет вакансий
              </div>
              <div v-else class="list-group list-group-flush" role="list">
                <router-link
                  v-for="job in myJobs"
                  :key="job.id"
                  :to="`/jobs/${job.id}`"
                  class="list-group-item list-group-item-action"
                  role="listitem"
                >
                  <div class="d-flex w-100 justify-content-between">
                    <div>
                      <h3 class="h6 mb-1">{{ job.title }}</h3>
                      <small class="text-muted">{{ job.location }} • от {{ formatSalary(job.salary) }} ₽</small>
                    </div>
                    <div class="text-end">
                      <span :class="['badge', getStatusClass(job.status), 'status-badge', 'mb-1']">
                        {{ getStatusText(job.status) }}
                      </span>
                      <div class="small text-muted">Откликов: {{ job.applicationsCount || 0 }}</div>
                    </div>
                  </div>
                </router-link>
              </div>
            </div>
          </section>

          <section class="card shadow-sm" aria-labelledby="applications-heading">
            <div class="card-body">
              <h2 class="h5 card-title mb-3" id="applications-heading">Последние отклики</h2>
              <div v-if="applicationsLoading" class="text-center py-3">
                <div class="spinner-border spinner-border-sm" role="status">
                  <span class="visually-hidden">Загрузка...</span>
                </div>
              </div>
              <div v-else-if="myApplications.length === 0" class="text-muted text-center py-3">
                Нет откликов
              </div>
              <div v-else class="table-responsive">
                <table class="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th scope="col">Кандидат</th>
                      <th scope="col">Вакансия</th>
                      <th scope="col">Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="app in myApplications" :key="app.id">
                      <td>{{ app.userName }}</td>
                      <td>{{ app.jobTitle }}</td>
                      <td>
                        <span :class="['badge', getStatusClass(app.status), 'status-badge']">
                          {{ getStatusText(app.status) }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>

    <VacancyFormModal v-if="showNewVacancyModal" @close="showNewVacancyModal = false" @saved="handleVacancySaved" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useJobs } from '@/composables/useJobs'
import { useApi } from '@/composables/useApi'
import VacancyFormModal from '@/components/VacancyFormModal.vue'

const { user, isAuthenticated, isEmployer } = useAuth()
const { jobs, loading, getAll } = useJobs()
const { apiClient } = useApi()

const showNewVacancyModal = ref(false)
const applicationsLoading = ref(false)
const myApplications = ref([])

const myJobs = computed(() => {
  if (!user.value) return []
  return jobs.value.filter(job => job.employerId === user.value.id)
})

const getUserInitials = (name) => {
  if (!name) return '??'
  const words = name.split(' ')
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

const formatSalary = (salary) => {
  return salary.toLocaleString('ru-RU')
}

const getStatusText = (status) => {
  const labels = {
    active: 'Активна',
    paused: 'На паузе',
    closed: 'Закрыта',
    pending: 'Новый',
    invited: 'Приглашён',
    rejected: 'Отклонён'
  }
  return labels[status] || status
}

const getStatusClass = (status) => {
  const classes = {
    active: 'text-bg-success',
    paused: 'text-bg-secondary',
    closed: 'text-bg-danger',
    pending: 'text-bg-warning',
    invited: 'text-bg-success',
    rejected: 'text-bg-danger'
  }
  return classes[status] || 'text-bg-secondary'
}

const handleVacancySaved = async () => {
  showNewVacancyModal.value = false
  await getAll()
}

const loadApplications = async () => {
  if (!user.value) return
  
  applicationsLoading.value = true
  try {
    const [applicationsRes, usersRes] = await Promise.all([
      apiClient.get('/applications'),
      apiClient.get('/users')
    ])
    
    const allApplications = applicationsRes.data
    const allUsers = usersRes.data
    const myJobIds = myJobs.value.map(j => j.id)
    
    const applications = allApplications.filter(app => myJobIds.includes(app.jobId))
    
    myApplications.value = await Promise.all(
      applications.map(async (app) => {
        const appUser = allUsers.find(u => u.id === app.userId)
        const job = jobs.value.find(j => j.id === app.jobId)
        return {
          ...app,
          userName: appUser?.name || appUser?.companyName || 'Неизвестно',
          jobTitle: job?.title || 'Неизвестно'
        }
      })
    )
  } catch (err) {
    console.error('Ошибка загрузки откликов:', err)
  } finally {
    applicationsLoading.value = false
  }
}

onMounted(async () => {
  if (!isAuthenticated.value || !isEmployer.value) {
    return
  }

  await getAll()
  await loadApplications()
})
</script>

