<template>
  <div class="col-md-6">
    <div class="vacancy-card h-100 d-flex flex-column">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <div>
          <p class="mb-1 text-muted small">{{ vacancy.company }}</p>
          <h5 class="mb-1">{{ vacancy.title }}</h5>
        </div>
        <span class="pill">{{ vacancy.posted || 'сегодня' }}</span>
      </div>
      <p class="text-muted small mb-2">{{ vacancy.city || '—' }} · {{ vacancy.format || 'office' }}</p>
      <div class="d-flex flex-wrap gap-2 mb-3">
        <span v-for="tag in (vacancy.tags || [])" :key="tag" class="tag">
          <i></i>{{ tag }}
        </span>
      </div>
      <div class="d-flex align-items-center justify-content-between mb-3">
        <span class="fw-semibold">{{ formatSalary(vacancy) }}</span>
        <span class="text-muted small"
          >{{ vacancy.experienceYears || 0 }}+ лет · {{ getExperienceLabel(vacancy.level) }}</span
        >
      </div>
      <p class="text-muted small flex-grow-1">{{ vacancy.description }}</p>
      <div class="d-flex gap-2 mt-3">
        <button class="btn btn-outline-light flex-grow-1" @click="$emit('view-details', vacancy)">
          Смотреть детали
        </button>
        <button
          class="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#applicationModal"
          @click="$emit('apply', vacancy)"
        >
          Откликнуться
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatSalary, getExperienceLabel } from '@/utils/vacancyHelpers'

defineProps({
  vacancy: { type: Object, required: true },
})

defineEmits(['view-details', 'apply'])
</script>
