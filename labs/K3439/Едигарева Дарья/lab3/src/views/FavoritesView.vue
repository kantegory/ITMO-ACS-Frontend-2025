<template>
  <section class="section container">
    <div class="section__header">
      <h2 class="section__title">Сохранённые вакансии</h2>
      <p class="section__subtitle">Избранное хранится в localStorage.</p>
    </div>
    <div class="row g-3">
      <div v-if="!favoriteVacancies.length" class="col-12">
        <p class="text-muted">Пока пусто. Добавьте вакансии в избранное.</p>
      </div>
      <div v-for="vacancy in favoriteVacancies" :key="vacancy.id" class="col-md-6">
        <vacancy-card
          :vacancy="vacancy"
          :is-favorite="true"
          @toggle-favorite="toggleFavorite"
        />
      </div>
    </div>
  </section>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useJobsStore } from '@/stores/jobs'
import VacancyCard from '@/components/VacancyCard.vue'

export default {
  name: 'FavoritesView',
  components: { VacancyCard },
  setup() {
    const store = useJobsStore()

    const favoriteVacancies = computed(() =>
      store.normalizedVacancies.filter((vacancy) =>
        store.favoritesSet.has(String(vacancy.id)),
      ),
    )

    const toggleFavorite = (id) => {
      store.toggleFavorite(id)
    }

    onMounted(() => {
      store.init()
    })

    return { favoriteVacancies, toggleFavorite }
  },
}
</script>
