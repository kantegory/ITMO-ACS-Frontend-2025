<template>
  <section class="section container">
    <div class="section__header">
      <h2 class="section__title">Личный кабинет работодателя</h2>
      <p class="section__subtitle">
        Управляйте вакансиями и добавляйте новые позиции для компании.
      </p>
    </div>

    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div>
            <div class="d-flex align-items-center gap-2">
              <svg class="icon" aria-hidden="true" focusable="false">
                <use href="/sprite.svg#icon-briefcase"></use>
              </svg>
              <h5 class="card-title mb-0">Мои вакансии</h5>
            </div>
            <p class="text-muted small mb-0">Список вакансий компании.</p>
          </div>
          <div class="d-flex flex-column align-items-end">
            <p class="text-muted small mb-1">
              {{ employerStatus }}
            </p>
          </div>
        </div>

        <div v-if="!employer" class="alert alert-info">
          Создайте профиль работодателя, чтобы управлять вакансиями.
        </div>

        <div v-if="employer" class="table-responsive">
          <table class="table align-middle">
            <thead>
              <tr>
                <th>Название</th>
                <th>Формат</th>
                <th>Опыт</th>
                <th class="text-end">Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!employerVacancies.length">
                <td colspan="4" class="text-muted">У компании пока нет вакансий.</td>
              </tr>
              <tr v-for="vacancy in employerVacancies" :key="vacancy.id">
                <td class="text-truncate" style="max-width: 260px;">
                  {{ vacancy.title }}
                </td>
                <td>{{ formatLabel(vacancy.format) }}</td>
                <td>{{ experienceLabel(vacancy.experienceBucket) }}</td>
                <td class="text-end">
                  <router-link class="btn btn-outline-primary btn-sm" :to="`/vacancies/${vacancy.id}`">
                    Открыть
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="employer && employerVacancies.length" class="mt-4">
          <h6 class="mb-3">Отклики по вакансиям</h6>
          <div
            v-for="vacancy in employerVacancies"
            :key="`responses-${vacancy.id}`"
            class="card border-0 shadow-sm mb-3"
          >
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start gap-2">
                <div>
                  <strong>{{ vacancy.title }}</strong>
                  <p class="text-muted small mb-0">
                    Откликов: {{ responsesByVacancy[String(vacancy.id)]?.length || 0 }}
                  </p>
                </div>
                <span class="badge">{{ formatLabel(vacancy.format) }}</span>
              </div>
              <ul
                v-if="responsesByVacancy[String(vacancy.id)]?.length"
                class="list-group list-group-flush mt-3"
              >
                <li
                  v-for="response in responsesByVacancy[String(vacancy.id)]"
                  :key="response.id"
                  class="list-group-item"
                >
                  <div class="d-flex flex-column gap-1">
                    <div class="d-flex justify-content-between gap-2">
                      <strong>{{ responseName(response) }}</strong>
                      <span class="text-muted small">{{ responseDate(response) }}</span>
                    </div>
                    <p v-if="responseProfile(response)?.position" class="mb-0 text-muted small">
                      {{ responseProfile(response).position }}
                    </p>
                    <p v-if="responseProfile(response)?.skills" class="mb-0 text-muted small">
                      Навыки: {{ responseProfile(response).skills }}
                    </p>
                  </div>
                </li>
              </ul>
              <p v-else class="text-muted small mt-2 mb-0">Пока нет откликов.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!employer" class="card shadow-sm mb-4">
      <div class="card-body">
        <h5 class="card-title">Профиль работодателя</h5>
        <form class="row g-3" @submit.prevent="createEmployer">
          <div class="col-md-6">
            <label class="form-label">Компания</label>
            <select class="form-select" v-model="employerForm.companyId" required>
              <option value="" disabled>Выберите</option>
              <option v-for="company in companies" :key="company.id" :value="company.id">
                {{ company.name }}
              </option>
            </select>
          </div>
          <div class="col-md-6">
            <label class="form-label">Телефон</label>
            <input type="text" class="form-control" v-model="employerForm.phone" required />
          </div>
          <div class="col-12">
            <button class="btn btn-primary minw-140" type="submit">Создать профиль</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="employer" class="card shadow-sm">
      <div class="card-body">
        <h5 class="card-title">Создать вакансию</h5>
        <form class="row g-3" @submit.prevent="createVacancy">
          <div class="col-12">
            <label class="form-label">Название</label>
            <input type="text" class="form-control" v-model="vacancyForm.title" required />
          </div>
          <div class="col-md-6">
            <label class="form-label">Отрасль</label>
            <select class="form-select" v-model="vacancyForm.industry" required>
              <option value="" disabled>Выберите</option>
              <option v-for="industry in industries" :key="industry.value" :value="industry.value">
                {{ industry.label }}
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">От</label>
            <input type="number" class="form-control" v-model.number="vacancyForm.salaryMin" />
          </div>
          <div class="col-md-3">
            <label class="form-label">До</label>
            <input type="number" class="form-control" v-model.number="vacancyForm.salaryMax" />
          </div>
          <div class="col-md-6">
            <label class="form-label">Опыт (лет)</label>
            <input type="number" class="form-control" v-model.number="vacancyForm.experienceRequired" />
          </div>
          <div class="col-md-6">
            <label class="form-label">Формат</label>
            <select class="form-select" v-model="vacancyForm.format" required>
              <option value="office">Офис</option>
              <option value="hybrid">Гибрид</option>
              <option value="remote">Удалённо</option>
            </select>
          </div>
          <div class="col-12">
            <label class="form-label">Описание</label>
            <textarea class="form-control" rows="3" v-model="vacancyForm.description" required></textarea>
          </div>
          <div class="col-12">
            <label class="form-label">Требования</label>
            <textarea class="form-control" rows="3" v-model="vacancyForm.requirements"></textarea>
          </div>
          <div class="col-12">
            <button class="btn btn-primary minw-140" type="submit">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
import { computed, onMounted, reactive } from 'vue'
import { useJobsStore } from '@/stores/jobs'
import { INDUSTRIES } from '@/constants/industries'
import { experienceLabel, formatLabel } from '@/utils/labels'

export default {
  name: 'EmployerView',
  setup() {
    const store = useJobsStore()
    const employerForm = reactive({
      companyId: '',
      phone: '',
    })
    const vacancyForm = reactive({
      title: '',
      industry: '',
      salaryMin: '',
      salaryMax: '',
      experienceRequired: '',
      format: 'office',
      description: '',
      requirements: '',
    })

    const employerVacancies = computed(() => {
      if (!store.employer) return []
      return store.normalizedVacancies.filter(
        (vacancy) =>
          String(vacancy.companyId) === String(store.employer.companyId),
      )
    })

    const employerStatus = computed(() =>
      store.employer
        ? `Компания: ${store.companiesMap[String(store.employer.companyId)]?.name || ''}`
        : 'Требуется профиль работодателя',
    )

    const responsesByVacancy = computed(() => {
      return store.responses.reduce((acc, response) => {
        const key = String(response.vacancyId)
        if (!acc[key]) acc[key] = []
        acc[key].push(response)
        return acc
      }, {})
    })

    const responseProfile = (response) => {
      return store.profilesMap[String(response.userId)] || null
    }

    const responseName = (response) => {
      const user = store.usersMap[String(response.userId)]
      return user?.fullName || responseProfile(response)?.fullName || `Пользователь #${response.userId}`
    }

    const responseDate = (response) => {
      return response.createdAt
        ? new Date(response.createdAt).toLocaleString('ru-RU')
        : 'дата не указана'
    }

    const createEmployer = async () => {
      await store.createEmployer({
        companyId: Number(employerForm.companyId),
        phone: employerForm.phone,
      })
    }

    const createVacancy = async () => {
      if (!store.employer) return
      const company = store.companiesMap[String(store.employer.companyId)]
      await store.createVacancy({
        title: vacancyForm.title,
        industry: vacancyForm.industry,
        salaryMin: vacancyForm.salaryMin || undefined,
        salaryMax: vacancyForm.salaryMax || undefined,
        experienceRequired: vacancyForm.experienceRequired || undefined,
        format: vacancyForm.format,
        description: vacancyForm.description,
        requirements: vacancyForm.requirements,
        location: company?.location || '—',
        companyId: Number(store.employer.companyId),
      })
      vacancyForm.title = ''
      vacancyForm.industry = ''
      vacancyForm.salaryMin = ''
      vacancyForm.salaryMax = ''
      vacancyForm.experienceRequired = ''
      vacancyForm.format = 'office'
      vacancyForm.description = ''
      vacancyForm.requirements = ''
    }

    onMounted(async () => {
      await store.loadCompanies()
      await store.loadVacancies()
      await store.loadEmployer()
      await store.loadResponses()
      try {
        await store.loadUsers()
      } catch {
        // ignore, покажем userId
      }
      try {
        await store.loadAllProfiles()
      } catch {
        // ignore, покажем userId
      }
    })

    return {
      companies: computed(() => store.companies),
      employer: computed(() => store.employer),
      employerVacancies,
      employerStatus,
      responsesByVacancy,
      responseProfile,
      responseName,
      responseDate,
      employerForm,
      vacancyForm,
      industries: INDUSTRIES,
      createEmployer,
      createVacancy,
      experienceLabel,
      formatLabel,
    }
  },
}
</script>
