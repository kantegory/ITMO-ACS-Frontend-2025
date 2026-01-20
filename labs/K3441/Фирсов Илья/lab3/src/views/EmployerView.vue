<template>
  <section class="section-padding">
    <div class="container">
      <div class="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <p class="eyebrow">ЛК работодателя</p>
          <h2 class="h1 mb-0">Управление вакансиями</h2>
        </div>
      </div>
      <div class="row g-4">
        <div class="col-lg-7">
          <div class="glass-panel p-4 h-100">
            <h6 class="mb-3 d-flex align-items-center gap-2">
              <svg class="icon" aria-hidden="true" focusable="false">
                <use href="#icon-shield"></use>
              </svg>
              Опубликованные позиции
            </h6>
            <div class="d-flex flex-column gap-3">
              <div
                v-for="(vacancy, index) in employerVacancies"
                :key="vacancy.id"
                class="d-flex justify-content-between align-items-center p-3 glass-panel"
              >
                <div>
                  <strong>{{ vacancy.title }}</strong>
                  <p class="text-muted small mb-0">
                    {{ (vacancy.industry || '').toUpperCase() }}
                    <template v-if="vacancy.salaryFrom || vacancy.salaryTo">
                      • {{ formatSalaryRange(vacancy) }}
                    </template>
                    • {{ vacancy.level }}
                  </p>
                </div>
                <button class="pill status-btn" @click="toggleVacancyStatus(index)">
                  {{ vacancy.status }}
                </button>
              </div>
              <div v-if="employerVacancies.length === 0" class="text-muted small">
                Вакансий пока нет
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-5">
          <div class="glass-panel p-4 h-100">
            <h6 class="mb-3 d-flex align-items-center gap-2">
              <svg class="icon" aria-hidden="true" focusable="false">
                <use href="#icon-chat"></use>
              </svg>
              Быстрое создание
            </h6>
            <form @submit.prevent="handleSubmit" class="vstack gap-3">
              <div>
                <label class="form-label">Название</label>
                <input type="text" v-model="form.title" class="form-control" required />
              </div>
              <div>
                <label class="form-label">Отрасль</label>
                <select v-model="form.industry" class="form-select">
                  <option value="it">IT</option>
                  <option value="finance">Финансы</option>
                  <option value="education">Образование</option>
                </select>
              </div>
              <div>
                <label class="form-label">Описание</label>
                <textarea
                  v-model="form.description"
                  class="form-control"
                  rows="4"
                  placeholder="Опишите вакансию..."
                ></textarea>
              </div>
              <div class="d-flex gap-2">
                <input
                  type="number"
                  v-model.number="form.salaryFrom"
                  class="form-control"
                  placeholder="Зарплата от, тыс (необязательно)"
                  min="0"
                />
                <input
                  type="number"
                  v-model.number="form.salaryTo"
                  class="form-control"
                  placeholder="Зарплата до, тыс (необязательно)"
                  min="0"
                />
              </div>
              <div>
                <select v-model="form.level" class="form-select">
                  <option value="middle">Middle</option>
                  <option value="senior">Senior</option>
                  <option value="junior">Junior</option>
                </select>
              </div>
              <button class="btn btn-primary" type="submit">Сохранить</button>
            </form>
          </div>
        </div>
      </div>
      <div class="row g-3 mt-3">
        <div class="col-12">
          <div class="glass-panel p-4">
            <h6 class="mb-3">Отклики на вакансии</h6>
            <div class="card-row">
              <ApplicationCard
                v-for="(app, index) in employerApplications"
                :key="app.id || index"
                :application="app"
                :editable="true"
                @change-status="changeApplicationStatus(app)"
              />
              <div v-if="employerApplications.length === 0" class="text-muted small">
                Откликов пока нет
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, onMounted } from 'vue'
import { useJobsStore } from '@/stores/jobs'
import ApplicationCard from '@/components/ApplicationCard.vue'
import { formatSalary } from '@/utils/vacancyHelpers'

const store = useJobsStore()

onMounted(async () => {
  // Инициализируем данные при загрузке страницы
  if (store.vacancies.length === 0 || store.employerVacancies.length === 0) {
    await store.init()
  }
})

const employerVacancies = computed(() => store.employerVacancies)
const employerApplications = computed(() => store.applications)

const formatSalaryRange = (vacancy) => {
  if (!vacancy.salaryFrom && !vacancy.salaryTo) return ''
  return formatSalary(vacancy)
}

const form = reactive({
  title: '',
  industry: 'it',
  description: '',
  salaryFrom: null,
  salaryTo: null,
  level: 'middle',
})

const statusOrder = ['опубликована', 'в работе', 'черновик']
const applicationStatusOrder = ['В рассмотрении', 'Интервью назначено', 'Оффер', 'Отклонено']

const toggleVacancyStatus = (index) => {
  const vacancy = employerVacancies.value[index]
  if (!vacancy) return
  const currentIndex = statusOrder.indexOf(vacancy.status)
  const nextIndex = (currentIndex + 1) % statusOrder.length
  store.updateEmployerVacancyStatus(vacancy.id, statusOrder[nextIndex])
}

const changeApplicationStatus = (application) => {
  const currentIndex = applicationStatusOrder.indexOf(application.status || applicationStatusOrder[0])
  const nextIndex = (currentIndex + 1) % applicationStatusOrder.length
  store.updateApplicationStatus(application.id, applicationStatusOrder[nextIndex])
}

const handleSubmit = async () => {
  const newVacancy = {
    title: form.title,
    company: 'Моя компания',
    city: '—',
    industry: form.industry,
    format: 'office',
    salaryFrom: form.salaryFrom || null,
    salaryTo: form.salaryTo || null,
    level: form.level,
    experienceYears: form.level === 'senior' ? 5 : form.level === 'middle' ? 3 : 1,
    posted: 'сегодня',
    status: 'опубликована',
    tags: [],
    description: form.description || 'Новая вакансия работодателя',
    requirements: [],
    benefits: ['Гибкий график', 'Медстраховка', 'Команда'],
  }

  await store.createEmployerVacancy(newVacancy)

  form.title = ''
  form.description = ''
  form.salaryFrom = null
  form.salaryTo = null
  form.level = 'middle'
  form.industry = 'it'
}
</script>
