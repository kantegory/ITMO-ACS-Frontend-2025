<template>
  <div class="job-card h-100 p-3 d-flex flex-column">
    <div class="d-flex align-items-start justify-content-between gap-2 mb-2 min-w-0">
      <h3 class="job-card__title flex-grow-1">{{ vacancy.title }}</h3>
      <span class="badge bg-light text-dark border">{{ vacancy.industryLabel }}</span>
    </div>
    <p class="job-card__meta mb-2">
      {{ vacancy.company?.name }} • {{ vacancy.location }} • {{ formatLabel(vacancy.format) }}
    </p>
    <p class="job-card__description mb-3">{{ vacancy.description }}</p>
    <div class="job-card__footer mt-auto">
      <div class="d-flex flex-wrap align-items-center gap-2">
        <span class="badge bg-primary-subtle text-primary fw-semibold">
          {{ salaryLabel }}
        </span>
        <span v-if="vacancy.salaryMax" class="badge bg-success-subtle text-success fw-semibold">
          до {{ vacancy.salaryMax.toLocaleString('ru-RU') }} ₽
        </span>
        <span class="badge bg-secondary-subtle text-secondary">
          {{ experienceLabel(vacancy.experienceBucket) }}
        </span>
      </div>
      <div class="d-flex gap-2">
        <router-link class="btn btn-outline-primary btn-sm" :to="detailsLink">
          Подробнее
        </router-link>
        <button class="btn btn-warning btn-sm" type="button" @click="$emit('toggle-favorite', vacancy.id)">
          {{ isFavorite ? 'Убрать' : 'В избранное' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { experienceLabel, formatLabel } from '@/utils/labels'

export default {
  name: 'VacancyCard',
  props: {
    vacancy: {
      type: Object,
      required: true,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    detailsLink() {
      return `/vacancies/${this.vacancy.id}`
    },
    salaryLabel() {
      if (this.vacancy.salaryMin) {
        return `от ${this.vacancy.salaryMin.toLocaleString('ru-RU')} ₽`
      }
      return 'По договоренности'
    },
  },
  methods: {
    experienceLabel,
    formatLabel,
  },
}
</script>
