<template>
  <section class="hero">
    <div class="container">
      <div class="row align-items-center gy-4">
        <div class="col-lg-7">
          <p class="hero__eyebrow text-uppercase mb-2">Сайт для поиска работы</p>
          <h1 class="hero__title">
            Найдите вакансию мечты и покажите своё резюме за минуту
          </h1>
          <p class="hero__subtitle">
            Быстрая фильтрация по отрасли, зарплате и опыту. Карточки с аккуратным
            обрезанием длинных текстов, чтобы интерфейс не ломался.
          </p>
          <div class="hero__actions">
            <router-link class="btn btn-warning btn-lg" to="/jobs">
              К списку вакансий
            </router-link>
            <router-link class="btn btn-outline-light btn-lg" to="/profile">
              Открыть резюме
            </router-link>
          </div>
        </div>
        <div class="col-lg-5">
          <div class="hero__card card shadow-lg">
            <div class="card-body">
              <p class="text-uppercase text-muted small mb-1">Быстрый поиск</p>
              <form class="hero__form" @submit.prevent="onQuickSearch">
                <div class="mb-3">
                  <label class="form-label" for="quickSearch">Ключевые слова</label>
                  <input
                    id="quickSearch"
                    v-model="quickSearch"
                    type="text"
                    class="form-control"
                    placeholder="React, аналитик, стажёр"
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label d-flex align-items-center gap-2" for="quickCity">
                    <svg class="icon icon--muted" aria-hidden="true" focusable="false">
                      <use href="/sprite.svg#icon-map-pin"></use>
                    </svg>
                    <span>Город или удалёнка</span>
                  </label>
                  <input
                    id="quickCity"
                    v-model="quickCity"
                    type="text"
                    class="form-control"
                    placeholder="Санкт-Петербург"
                  />
                </div>
                <button
                  class="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                  type="submit"
                >
                  <svg class="icon" aria-hidden="true" focusable="false">
                    <use href="/sprite.svg#icon-search"></use>
                  </svg>
                  <span>Показать подходящие</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section container">
    <div class="section__header">
      <h2 class="section__title">Популярные вакансии</h2>
      <p class="section__subtitle">Несколько позиций из базы для быстрого старта.</p>
    </div>
    <div class="row g-3">
      <div v-for="vacancy in topVacancies" :key="vacancy.id" class="col-md-6">
        <vacancy-card
          :vacancy="vacancy"
          :is-favorite="favoritesSet.has(String(vacancy.id))"
          @toggle-favorite="toggleFavorite"
        />
      </div>
    </div>
  </section>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useJobsStore } from '@/stores/jobs'
import { useVacancyFilters } from '@/composables/useVacancyFilters'
import VacancyCard from '@/components/VacancyCard.vue'

export default {
  name: 'HomeView',
  components: { VacancyCard },
  setup() {
    const router = useRouter()
    const store = useJobsStore()
    const { applyQuickSearch } = useVacancyFilters()
    const quickSearch = ref('')
    const quickCity = ref('')

    const topVacancies = computed(() => store.normalizedVacancies.slice(0, 4))
    const favoritesSet = computed(() => store.favoritesSet)

    const onQuickSearch = () => {
      applyQuickSearch(quickSearch.value, quickCity.value)
      router.push('/jobs')
    }

    const toggleFavorite = (id) => {
      store.toggleFavorite(id)
    }

    onMounted(() => {
      store.init()
    })

    return {
      quickSearch,
      quickCity,
      onQuickSearch,
      topVacancies,
      favoritesSet,
      toggleFavorite,
    }
  },
}
</script>
