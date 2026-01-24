<template>
  <div>
    <header class="dashboard-header py-4 mb-4 mt-5">
      <div class="container d-flex flex-wrap align-items-center gap-3">
        <div class="avatar-circle me-2" aria-hidden="true">
          <span>{{ getUserInitials(user?.name) }}</span>
        </div>
        <div>
          <h1 class="h4 mb-1">{{ user?.name }}</h1>
          <div class="small">{{ user?.position || '' }} • {{ user?.city || '' }}</div>
        </div>
        <nav class="ms-auto d-flex flex-wrap gap-2" aria-label="Действия в личном кабинете">
          <button class="btn btn-light btn-sm" @click="showEditModal = true">Редактировать резюме</button>
          <router-link to="/" class="btn btn-outline-light btn-sm">Найти вакансии</router-link>
        </nav>
      </div>
    </header>

    <main class="container pb-5">
      <div class="row g-4">
        <div class="col-lg-8">
          <section id="resume" class="card shadow-sm mb-4" aria-labelledby="resume-heading">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h2 class="h5 card-title mb-0" id="resume-heading">Резюме</h2>
                <button
                  class="btn btn-outline-primary btn-sm"
                  @click="showEditModal = true"
                  aria-label="Редактировать резюме"
                >
                  <span class="icon icon-sm me-1">
                    <svg><use href="#icon-edit"></use></svg>
                  </span>
                  Редактировать
                </button>
              </div>

              <div v-if="loading" class="text-center py-3">
                <div class="spinner-border spinner-border-sm" role="status">
                  <span class="visually-hidden">Загрузка...</span>
                </div>
              </div>
              <div v-else-if="resume">
                <div class="mb-3">
                  <div class="resume-block-title mb-1">Желаемая должность</div>
                  <div>{{ resume.position || 'Не указано' }}</div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <div class="resume-block-title mb-1">Уровень дохода</div>
                    <div>{{ resume.salary ? `от ${formatSalary(resume.salary)} ₽` : 'Не указано' }}</div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <div class="resume-block-title mb-1">Занятость</div>
                    <div>{{ resume.employmentType || 'Не указано' }}</div>
                  </div>
                </div>

                <div class="mb-3" v-if="resume.skills && resume.skills.length > 0">
                  <div class="resume-block-title mb-1">Навыки</div>
                  <span v-for="skill in resume.skills" :key="skill" class="badge bg-primary me-1">{{ skill }}</span>
                </div>

                <div class="mb-3" v-if="resume.experience && resume.experience.length > 0">
                  <div class="resume-block-title mb-1">Опыт работы</div>
                  <div v-for="(exp, index) in resume.experience" :key="index">
                    <p class="mb-1 fw-semibold">{{ exp.position }} — {{ exp.company }}</p>
                    <p class="mb-0 text-muted small">{{ exp.period }} • {{ exp.description }}</p>
                  </div>
                </div>

                <div v-if="resume.education">
                  <div class="resume-block-title mb-1">Образование</div>
                  <p class="mb-0">{{ resume.education }}</p>
                </div>
              </div>
            </div>
          </section>

          <section class="card shadow-sm" aria-labelledby="applications-heading">
            <div class="card-body">
              <h2 class="h5 card-title mb-3" id="applications-heading">Отклики</h2>
              <div v-if="applicationsLoading" class="text-center py-3">
                <div class="spinner-border spinner-border-sm" role="status">
                  <span class="visually-hidden">Загрузка...</span>
                </div>
              </div>
              <div v-else-if="applications.length === 0" class="text-muted text-center py-3">
                У вас пока нет откликов
              </div>
              <div v-else class="list-group list-group-flush" role="list">
                <router-link
                  v-for="app in applicationsWithJobs"
                  :key="app.id"
                  :to="`/jobs/${app.jobId}`"
                  class="list-group-item list-group-item-action"
                  role="listitem"
                >
                  <div class="d-flex w-100 justify-content-between">
                    <div>
                      <h3 class="h6 mb-1">{{ app.job?.title }}</h3>
                      <small class="text-muted">{{ app.job?.company }} • {{ app.job?.location }}</small>
                    </div>
                    <span :class="['badge', 'rounded-pill', getStatusClass(app.status), 'align-self-start']">
                      {{ getStatusText(app.status) }}
                    </span>
                  </div>
                </router-link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>

    <ResumeEditModal v-if="showEditModal" :resume="resume" @close="showEditModal = false" @saved="handleResumeSaved" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useResumes } from '@/composables/useResumes'
import { useApplications } from '@/composables/useApplications'
import { useJobs } from '@/composables/useJobs'
import ResumeEditModal from '@/components/ResumeEditModal.vue'

const { user, isAuthenticated, isCandidate } = useAuth()
const { resume, loading, getByUserId } = useResumes()
const { applications, loading: applicationsLoading, getByUserId: getApplications } = useApplications()
const { getById: getJobById } = useJobs()

const showEditModal = ref(false)

const getUserInitials = (name) => {
  if (!name) return '??'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

const formatSalary = (salary) => {
  return salary.toLocaleString('ru-RU')
}

const getStatusText = (status) => {
  const labels = {
    pending: 'Рассматривается',
    invited: 'Приглашение на собеседование',
    rejected: 'Отклонено'
  }
  return labels[status] || status
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'text-bg-warning',
    invited: 'text-bg-success',
    rejected: 'text-bg-danger'
  }
  return classes[status] || 'text-bg-secondary'
}

const applicationsWithJobs = ref([])

const handleResumeSaved = async () => {
  showEditModal.value = false
  if (user.value) {
    await getByUserId(user.value.id)
  }
}

onMounted(async () => {
  if (!isAuthenticated.value || !isCandidate.value) {
    // Перенаправление обработает роутер
    return
  }

  if (user.value) {
    await Promise.all([
      getByUserId(user.value.id),
      loadApplications()
    ])
  }
})

const loadApplications = async () => {
  if (!user.value) return
  
  try {
    await getApplications(user.value.id)
    
    // Загружаем данные о вакансиях для каждого отклика
    applicationsWithJobs.value = await Promise.all(
      applications.value.map(async (app) => {
        try {
          const job = await getJobById(app.jobId)
          return { ...app, job }
        } catch (err) {
          console.error('Ошибка загрузки вакансии:', err)
          return { ...app, job: null }
        }
      })
    )
  } catch (err) {
    console.error('Ошибка загрузки откликов:', err)
  }
}
</script>

