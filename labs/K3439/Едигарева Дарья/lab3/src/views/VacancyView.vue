<template>
  <section class="section container">
    <div class="section__header">
      <h2 class="section__title">Страница детали вакансии</h2>
    </div>
    <div class="row g-4">
      <div class="col-lg-7">
        <article class="vacancy card shadow-sm h-100" aria-live="polite" aria-atomic="true">
          <div class="card-body" v-if="vacancy">
            <p class="text-muted mb-1">
              {{ vacancy.company?.name }} • {{ vacancy.location }} •
              {{ formatLabel(vacancy.format) }}
            </p>
            <h3 class="vacancy__title">{{ vacancy.title }}</h3>
            <p class="vacancy__text">
              Зарплата: {{ salaryRange }} • Опыт: {{ experienceLabel(vacancy.experienceBucket) }}
            </p>
            <p class="vacancy__text">{{ vacancy.description }}</p>
            <ul class="vacancy__list">
              <li v-for="item in vacancy.requirements" :key="item">{{ item }}</li>
            </ul>
            <div class="d-flex flex-wrap gap-2">
              <span v-for="tag in vacancy.tags" :key="tag" class="pill pill--muted">{{ tag }}</span>
            </div>
            <div class="d-flex flex-wrap align-items-center gap-2 mt-3">
              <button
                class="btn btn-primary"
                type="button"
                :disabled="isApplying || isApplied"
                @click="apply"
              >
                {{ isApplied ? 'Отклик отправлен' : 'Откликнуться' }}
              </button>
              <span v-if="applyError" class="text-danger small">{{ applyError }}</span>
            </div>
          </div>
          <div class="card-body" v-else>
            <p class="text-muted mb-1">Вакансия не найдена</p>
            <p class="vacancy__text">Проверьте ссылку или вернитесь к списку вакансий.</p>
          </div>
        </article>
      </div>
      <div class="col-lg-5">
        <resume-card :profile="profile" />
      </div>
    </div>
  </section>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useJobsStore } from '@/stores/jobs'
import { experienceLabel, formatLabel } from '@/utils/labels'
import ResumeCard from '@/components/ResumeCard.vue'

export default {
  name: 'VacancyView',
  components: { ResumeCard },
  setup() {
    const route = useRoute()
    const store = useJobsStore()
    const isApplying = ref(false)
    const applyError = ref('')

    const vacancy = computed(() =>
      store.normalizedVacancies.find(
        (item) => String(item.id) === String(route.params.id),
      ),
    )

    const salaryRange = computed(() => {
      if (!vacancy.value) return '—'
      const min = vacancy.value.salaryMin
        ? vacancy.value.salaryMin.toLocaleString('ru-RU')
        : '—'
      const max = vacancy.value.salaryMax
        ? vacancy.value.salaryMax.toLocaleString('ru-RU')
        : '—'
      return `${min} — ${max} ₽`
    })

    onMounted(async () => {
      await store.init()
      await store.loadResponses(store.userId)
      await store.loadProfile()
    })

    const isApplied = computed(() => {
      if (!vacancy.value) return false
      return store.appliedVacancyIds.has(String(vacancy.value.id))
    })

    const apply = async () => {
      if (!vacancy.value) return
      applyError.value = ''
      isApplying.value = true
      try {
        await store.applyToVacancy(vacancy.value.id)
      } catch (error) {
        applyError.value = 'Не удалось отправить отклик. Попробуйте ещё раз.'
      } finally {
        isApplying.value = false
      }
    }

    return {
      vacancy,
      profile: computed(() => store.profile),
      salaryRange,
      experienceLabel,
      formatLabel,
      isApplying,
      isApplied,
      applyError,
      apply,
    }
  },
}
</script>
