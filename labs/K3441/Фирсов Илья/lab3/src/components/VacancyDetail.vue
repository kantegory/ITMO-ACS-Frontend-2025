<template>
  <div class="glass-panel p-4" aria-live="polite" aria-atomic="true">
    <div v-if="vacancy" class="d-flex justify-content-between flex-wrap gap-2 mb-2">
      <div>
        <h4 class="mb-1">{{ vacancy.title }}</h4>
        <p class="text-muted mb-0">{{ vacancy.company }} • {{ vacancy.city || '—' }}</p>
      </div>
      <div class="d-flex gap-2 align-items-center">
        <span class="pill">{{ formatSalary(vacancy) }}</span>
        <span class="pill">{{ getExperienceLabel(vacancy.level) }}</span>
        <button
          class="btn btn-contrast"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#applicationModal"
          @click="$emit('apply', vacancy)"
        >
          Откликнуться
        </button>
      </div>
    </div>
    <div v-if="vacancy" class="d-flex flex-wrap gap-2 mb-3">
      <span v-for="tag in (vacancy.tags || [])" :key="tag" class="tag">
        <i></i>{{ tag }}
      </span>
    </div>
    <p v-if="vacancy" class="mb-3">{{ vacancy.description }}</p>
    <div v-if="vacancy" class="row g-3">
      <div class="col-md-6">
        <h6 class="mb-2">Требования</h6>
        <ul class="text-muted small ps-3 mb-0">
          <li v-for="req in (vacancy.requirements || [])" :key="req">{{ req }}</li>
        </ul>
      </div>
      <div class="col-md-6">
        <h6 class="mb-2">Предлагаем</h6>
        <ul class="text-muted small ps-3 mb-0">
          <li v-for="benefit in (vacancy.benefits || [])" :key="benefit">{{ benefit }}</li>
        </ul>
      </div>
    </div>
    <div v-if="!vacancy">
      <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
        <div>
          <p class="eyebrow mb-1">Детали выбранной позиции</p>
          <h4 class="mb-0">Выберите вакансию</h4>
        </div>
      </div>
      <p class="text-muted mb-0">
        Нажмите «Смотреть детали» у вакансии справа, и здесь появится описание, требования и компания.
      </p>
    </div>
  </div>
</template>

<script setup>
import { formatSalary, getExperienceLabel } from '@/utils/vacancyHelpers'

defineProps({
  vacancy: { type: Object, default: null },
})

defineEmits(['apply'])
</script>
