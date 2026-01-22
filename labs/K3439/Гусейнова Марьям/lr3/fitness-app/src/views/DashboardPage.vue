<template>
  <section class="page-section" aria-labelledby="dashboard-title">
    <h2 class="mb-4 text-primary fw-bold" id="dashboard-title">
      Личный Кабинет <span>{{ userName }}</span>
    </h2>
    <div class="row g-4">
      <!-- Трекинг прогресса -->
      <div class="col-lg-6" role="region" aria-label="Раздел трекинга прогресса">
        <ProgressCard :progress="userProgress" />
      </div>

      <!-- Планы тренировок -->
      <div class="col-lg-6" role="region" aria-label="Раздел плана тренировок">
        <div class="card p-4 h-100">
          <h3 class="fw-bold mb-3">
            <svg class="icon me-2 text-primary" aria-hidden="true"><use href="/icons.svg#icon-calendar-check"></use></svg>
            Твой План Тренировок
          </h3>
          <div class="accordion" id="trainingPlanAccordion">
            <div v-if="trainingPlan.length === 0" class="text-muted text-center p-3">
              План тренировок пока пуст.
            </div>
            <div v-else v-for="(item, index) in trainingPlan" :key="index" class="accordion-item">
              <h2 class="accordion-header" :id="`heading${index}`">
                <button class="accordion-button" :class="{ collapsed: index !== 0 }" type="button" 
                  data-bs-toggle="collapse" :data-bs-target="`#collapse${index}`" 
                  :aria-expanded="index === 0" :aria-controls="`collapse${index}`">
                  {{ item.day }}: {{ item.title }}
                </button>
              </h2>
              <div :id="`collapse${index}`" class="accordion-collapse collapse" :class="{ show: index === 0 }" 
                :aria-labelledby="`heading${index}`" data-bs-parent="#trainingPlanAccordion">
                <div class="accordion-body">{{ item.details }}</div>
              </div>
            </div>
          </div>
          <button class="btn btn-primary mt-3">Изменить план</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useApi } from '../composables/useApi'
import ProgressCard from '../components/ProgressCard.vue'

export default {
  name: 'DashboardPage',
  components: {
    ProgressCard
  },
  setup() {
    const { get } = useApi()
    const userName = ref(localStorage.getItem('userName') || 'Пользователя')
    const userProgress = ref({
      weight: 75,
      weeklyWorkouts: 4,
      pushupGoal: 35
    })
    const trainingPlan = ref([])

    const loadDashboardData = async () => {
      const userId = localStorage.getItem('userId')
      if (!userId) return

      try {
        const user = await get(`/users/${userId}`)
        userProgress.value = user.progress
        trainingPlan.value = user.trainingPlan
      } catch (error) {
        console.error('Ошибка загрузки личного кабинета:', error)
      }
    }

    onMounted(() => {
      loadDashboardData()
    })

    return {
      userName,
      userProgress,
      trainingPlan
    }
  }
}
</script>