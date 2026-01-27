<template>
  <div class="col-12">
    <div class="glass-panel p-4 resume-card h-100">
      <div class="header-row">
        <div>
          <h5 class="mb-1">{{ resume.title || 'Моё резюме' }}</h5>
          <p class="text-muted small mb-0">{{ resume.city || '—' }} · {{ resume.experienceYears || 0 }}+ лет</p>
        </div>
        <div class="d-flex gap-2 align-items-center">
          <span class="status-chip">открыта к предложениям</span>
          <button class="btn btn-primary btn-sm" @click="$emit('edit', resume)">Редактировать</button>
        </div>
      </div>
      <p class="text-muted resume-summary mb-3">{{ resume.summary || 'Добавьте описание резюме.' }}</p>
      <div class="row g-3">
        <div class="col-sm-6">
          <h6 class="mb-1">Навыки</h6>
          <div class="tag-row">
            <span v-if="skills.length === 0" class="tag"><i></i>Навыки не указаны</span>
            <span v-for="skill in skills" :key="skill" class="tag"><i></i>{{ skill }}</span>
          </div>
        </div>
        <div class="col-sm-6">
          <h6 class="mb-1">Опыт</h6>
          <ul class="text-muted small mb-0 ps-3">
            <li>{{ resume.experienceYears || 0 }}+ лет опыта</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  resume: { type: Object, required: true },
})

const skills = computed(() => {
  if (Array.isArray(props.resume.skills)) {
    return props.resume.skills
  }
  return (props.resume.skills || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
})

defineEmits(['edit'])
</script>
