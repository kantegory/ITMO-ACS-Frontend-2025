<template>
  <router-link
    :to="`/jobs/${job.id}`"
    class="list-group-item list-group-item-action job-item"
    :data-industry="job.industry"
    :data-experience="job.experience"
    :data-salary="job.salary"
  >
    <div class="d-flex w-100 justify-content-between">
      <div>
        <h5 class="mb-1">{{ job.title }}</h5>
        <p class="mb-1 text-muted">{{ job.company }} • {{ job.location }} • {{ job.employmentType }}</p>
        <span class="badge bg-primary me-1">{{ industryLabels[job.industry] || job.industry }}</span>
        <span class="badge bg-secondary me-1">{{ expLabels[job.experience] || job.experience }}</span>
      </div>
      <div class="text-end">
        <div class="h5 mb-1">от {{ formatSalary(job.salary) }} ₽</div>
        <small class="text-muted">Опубликовано: {{ formatDate(job.publishedAt) }}</small>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  job: {
    type: Object,
    required: true
  }
})

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
</script>

