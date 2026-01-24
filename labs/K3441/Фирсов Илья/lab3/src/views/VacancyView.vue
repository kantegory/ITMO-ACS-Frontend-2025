<template>
  <section class="section-padding">
    <div class="container">
      <div v-if="vacancy" class="row">
        <div class="col-12">
          <VacancyDetail :vacancy="vacancy" @apply="handleApply" />
        </div>
      </div>
      <div v-else class="text-center">
        <p class="text-muted">Вакансия не найдена</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, inject } from 'vue'
import { useRoute } from 'vue-router'
import { useJobsStore } from '@/stores/jobs'
import VacancyDetail from '@/components/VacancyDetail.vue'

const route = useRoute()
const store = useJobsStore()
const openApplicationModal = inject('openApplicationModal', null)

const vacancy = computed(() => {
  return store.normalizedVacancies.find((v) => String(v.id) === String(route.params.id))
})

const handleApply = (vacancy) => {
  if (openApplicationModal) {
    openApplicationModal(vacancy)
  }
}
</script>
