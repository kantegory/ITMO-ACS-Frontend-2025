<template>
  <section class="page-section" aria-labelledby="search-title">
    <h2 class="mb-4 text-primary fw-bold" id="search-title">Найти Идеальную Тренировку</h2>
    <div class="row g-4">
      <!-- Панель фильтров -->
      <div class="col-lg-4">
        <div class="filter-group" role="search" aria-label="Фильтры для поиска тренировок">
          <h3 class="mb-3 fw-bold">Фильтры</h3>
          <form @submit.prevent="applyFilters">
            <div class="mb-3">
              <label for="filterLevel" class="form-label">Уровень</label>
              <select class="form-select" id="filterLevel" v-model="filters.level">
                <option value="">Все уровни</option>
                <option value="начинающий">Начинающий</option>
                <option value="средний">Средний</option>
                <option value="продвинутый">Продвинутый</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="filterType" class="form-label">Тип</label>
              <select class="form-select" id="filterType" v-model="filters.type">
                <option value="">Все типы</option>
                <option value="кардио">Кардио</option>
                <option value="силовые">Силовые</option>
                <option value="йога">Йога</option>
                <option value="hiit">HIIT</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="filterDuration" class="form-label">Продолжительность в минутах (макс.)</label>
              <input type="range" class="form-range" min="10" max="90" step="5" 
                v-model="filters.duration" id="filterDuration" 
                aria-valuemin="10" aria-valuemax="90" :aria-valuenow="filters.duration"
                aria-describedby="durationValue" aria-label="Максимальная продолжительность тренировки в минутах">
              <div class="d-flex justify-content-between">
                <small>10 мин</small><small>{{ filters.duration }} мин</small><small>90 мин</small>
              </div>
            </div>
            <div class="d-grid">
              <button type="submit" class="btn btn-primary mt-2">Применить фильтры</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Список результатов тренировок -->
      <div class="col-lg-8" id="trainingResults" role="feed" :aria-busy="loading" aria-label="Результаты поиска тренировок">
        <div v-if="loading" class="text-center">Поиск тренировок...</div>
        <div v-else-if="workouts.length === 0" class="text-center text-muted">
          По вашему запросу тренировок не найдено.
        </div>
        <WorkoutCard 
          v-for="workout in workouts" 
          :key="workout.id" 
          :workout="workout"
          @show-details="showTrainingDetails"
        />
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted, inject } from 'vue'
import { useApi } from '../composables/useApi'
import { useNotification } from '../composables/useNotification'
import WorkoutCard from '../components/WorkoutCard.vue'

export default {
  name: 'SearchPage',
  components: {
    WorkoutCard
  },
  setup() {
    const { get, loading } = useApi()
    const { showSuccess } = useNotification()
    const trainingDetailModal = inject('trainingDetailModal')
    const workouts = ref([])
    const filters = ref({
      level: '',
      type: '',
      duration: 30
    })

    const loadWorkouts = async () => {
      try {
        const queryParams = new URLSearchParams()
        if (filters.value.level) queryParams.append('level', filters.value.level)
        if (filters.value.type) queryParams.append('type', filters.value.type)
        if (filters.value.duration) queryParams.append('duration_lte', filters.value.duration)

        const queryString = queryParams.toString()
        const endpoint = queryString ? `/workouts?${queryString}` : '/workouts'
        
        workouts.value = await get(endpoint)
      } catch (error) {
        console.error('Ошибка загрузки тренировок:', error)
        workouts.value = []
      }
    }

    const applyFilters = async () => {
      await loadWorkouts()
      showSuccess(`Поиск завершен! Найдено ${workouts.value.length} тренировок.`)
    }

    const showTrainingDetails = async (workoutId) => {
      try {
        const workout = await get(`/workouts/${workoutId}`)
        trainingDetailModal.value.showTrainingDetails(workout)
      } catch (error) {
        console.error('Ошибка загрузки деталей тренировки:', error)
      }
    }

    onMounted(() => {
      loadWorkouts()
    })

    return {
      workouts,
      filters,
      loading,
      applyFilters,
      showTrainingDetails
    }
  }
}
</script>