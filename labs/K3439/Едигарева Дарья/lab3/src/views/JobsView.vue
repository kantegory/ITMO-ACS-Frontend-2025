<template>
  <section class="section container">
    <div class="section__header">
      <h2 class="section__title">Поиск вакансий</h2>
      <p class="section__subtitle">Фильтрация по отрасли, зарплате и опыту.</p>
    </div>
    <div class="row g-4">
      <aside class="col-12 col-lg-4 x-no-bg">
        <filters-panel
          :filters="filters"
          :industries="industries"
          @reset="resetFilters"
          @change="saveFilters"
        />
      </aside>
      <div class="col-12 col-lg-8">
        <active-filters :items="activeFilters" />
        <div class="row g-3">
          <div v-if="!filteredVacancies.length" class="col-12">
            <p class="text-muted">Ничего не нашлось, попробуйте ослабить фильтры.</p>
          </div>
          <div v-for="vacancy in filteredVacancies" :key="vacancy.id" class="col-md-6">
            <vacancy-card
              :vacancy="vacancy"
              :is-favorite="favoritesSet.has(String(vacancy.id))"
              @toggle-favorite="toggleFavorite"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useJobsStore } from '@/stores/jobs'
import { INDUSTRIES } from '@/constants/industries'
import { useVacancyFilters } from '@/composables/useVacancyFilters'
import FiltersPanel from '@/components/FiltersPanel.vue'
import ActiveFilters from '@/components/ActiveFilters.vue'
import VacancyCard from '@/components/VacancyCard.vue'

export default {
  name: 'JobsView',
  components: { FiltersPanel, ActiveFilters, VacancyCard },
  setup() {
    const store = useJobsStore()
    const { filters, filteredVacancies, activeFilters, reset, save } =
      useVacancyFilters()

    const favoritesSet = computed(() => store.favoritesSet)

    const resetFilters = () => {
      reset()
    }

    const saveFilters = () => {
      save()
    }

    const toggleFavorite = (id) => {
      store.toggleFavorite(id)
    }

    onMounted(() => {
      store.init()
    })

    return {
      filters,
      industries: INDUSTRIES,
      filteredVacancies,
      activeFilters,
      favoritesSet,
      resetFilters,
      saveFilters,
      toggleFavorite,
    }
  },
}
</script>
