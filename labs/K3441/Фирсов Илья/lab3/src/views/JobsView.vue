<template>
  <section class="section-padding">
    <div class="container">
      <div class="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <p class="eyebrow">Поиск</p>
          <h2 class="h1 mb-1">Вакансии с фильтрами по отрасли, зарплате и опыту</h2>
          <p class="text-muted mb-0">Фильтры слева, подходящие позиции справа.</p>
        </div>
      </div>
      <div class="row g-4">
        <div class="col-lg-4">
          <FiltersPanel @filter="applyFilters" />
        </div>
        <div class="col-lg-8">
          <div class="row g-3">
            <VacancyCard
              v-for="vacancy in filtersStore.filteredVacancies"
              :key="vacancy.id"
              :vacancy="vacancy"
              @view-details="selectedVacancy = vacancy"
              @apply="handleApply"
            />
            <div v-if="filtersStore.filteredVacancies.length === 0" class="col-12">
              <div class="glass-panel p-4 text-center">
                <p class="text-muted mb-0">Вакансии не найдены</p>
              </div>
            </div>
          </div>
          <div class="mt-4">
            <VacancyDetail :vacancy="selectedVacancy" @apply="handleApply" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import { useFiltersStore } from '@/stores/filters'
import FiltersPanel from '@/components/FiltersPanel.vue'
import VacancyCard from '@/components/VacancyCard.vue'
import VacancyDetail from '@/components/VacancyDetail.vue'

const filtersStore = useFiltersStore()
const selectedVacancy = ref(null)
const openApplicationModal = inject('openApplicationModal', null)

onMounted(async () => {
  // Загружаем вакансии с текущими фильтрами при монтировании
  await filtersStore.applyFilters()
})

const applyFilters = async () => {
  await filtersStore.applyFilters()
}

const handleApply = (vacancy) => {
  selectedVacancy.value = vacancy
  if (openApplicationModal) {
    openApplicationModal(vacancy)
  }
}
</script>
