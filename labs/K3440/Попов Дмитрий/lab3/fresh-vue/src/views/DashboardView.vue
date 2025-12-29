<template>
  <div>
    <div class="mb-4">
      <h2 class="h3 fw-bold mb-1">
        <i class="bi bi-person-circle text-primary me-2"></i>Личный Кабинет
      </h2>
      <p class="text-muted">Добро пожаловать, <span class="fw-semibold">{{ user?.name }}</span></p>
    </div>

    <div class="row g-4">
      <div class="col-lg-6">
        <div class="card p-4 h-100">
          <h4 class="fw-bold mb-3">
            <i class="bi bi-graph-up me-2 text-success"></i>Трекинг Прогресса
          </h4>
          <ul class="list-group list-group-flush">
            <li class="list-group-item d-flex justify-content-between align-items-center">
              Вес: {{ progress.weight }} кг
              <span class="badge bg-success">↓ {{ progress.weightChange }} кг</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              Тренировок за неделю: {{ progress.weeklyWorkouts }}
              <span class="badge bg-primary">+{{ progress.workoutsChange }}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              Цель: {{ progress.goal }}
              <span class="badge bg-warning text-dark">{{ progress.goalProgress }}</span>
            </li>
          </ul>
          <button @click="updateProgress" class="btn btn-outline-success mt-3">
            <i class="bi bi-arrow-repeat me-2"></i>Обновить данные
          </button>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="card p-4 h-100">
          <h4 class="fw-bold mb-3">
            <i class="bi bi-calendar-check me-2 text-primary"></i>Твой План Тренировок
          </h4>
          <div class="accordion" id="trainingPlanAccordion">
            <div v-for="(day, index) in trainingPlan" :key="index" class="accordion-item">
              <h2 class="accordion-header">
                <button
                    class="accordion-button"
                    :class="{'collapsed': index !== 0}"
                    type="button"
                    data-bs-toggle="collapse"
                    :data-bs-target="`#collapse${index}`"
                    :aria-expanded="index === 0"
                >
                  {{ day.day }}: {{ day.title }}
                </button>
              </h2>
              <div
                  :id="`collapse${index}`"
                  class="accordion-collapse collapse"
                  :class="{'show': index === 0}"
                  data-bs-parent="#trainingPlanAccordion"
              >
                <div class="accordion-body">
                  {{ day.description }}
                </div>
              </div>
            </div>
          </div>
          <button @click="editPlan" class="btn btn-primary mt-3">
            <i class="bi bi-pencil me-2"></i>Изменить план
          </button>
        </div>
      </div>

      <div class="col-12">
        <div class="card p-4">
          <h4 class="fw-bold mb-3">
            <i class="bi bi-bar-chart me-2 text-info"></i>Статистика за месяц
          </h4>
          <div class="row g-3">
            <div class="col-md-3">
              <div class="stat-card text-center p-3 bg-light rounded">
                <i class="bi bi-fire fs-2 text-danger"></i>
                <h5 class="mt-2 mb-0">{{ stats.calories }}</h5>
                <small class="text-muted">Калорий сожжено</small>
              </div>
            </div>
            <div class="col-md-3">
              <div class="stat-card text-center p-3 bg-light rounded">
                <i class="bi bi-clock-history fs-2 text-primary"></i>
                <h5 class="mt-2 mb-0">{{ stats.hours }}ч</h5>
                <small class="text-muted">Часов тренировок</small>
              </div>
            </div>
            <div class="col-md-3">
              <div class="stat-card text-center p-3 bg-light rounded">
                <i class="bi bi-trophy fs-2 text-warning"></i>
                <h5 class="mt-2 mb-0">{{ stats.achievements }}</h5>
                <small class="text-muted">Достижений</small>
              </div>
            </div>
            <div class="col-md-3">
              <div class="stat-card text-center p-3 bg-light rounded">
                <i class="bi bi-heart-pulse fs-2 text-danger"></i>
                <h5 class="mt-2 mb-0">{{ stats.avgHeartRate }}</h5>
                <small class="text-muted">Средний пульс</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {useAuth} from '../common/useAuth'

const {user} = useAuth()

const progress = ref({
  weight: 75,
  weightChange: -1.5,
  weeklyWorkouts: 4,
  workoutsChange: 1,
  goal: '50 отжиманий',
  goalProgress: '35/50'
})

const trainingPlan = ref([
  {
    day: 'Понедельник',
    title: 'Силовая (Грудь/Спина)',
    description: 'Жим лежа (3x10), Тяга блока (3x12), Отжимания (до отказа).'
  },
  {
    day: 'Среда',
    title: 'Кардио (Бег 5 км)',
    description: 'Разминка 10 мин, Бег 5 км в среднем темпе, Заминка 5 мин.'
  },
  {
    day: 'Пятница',
    title: 'Силовая (Ноги)',
    description: 'Приседания (4x12), Выпады (3x10), Подъемы на носки (3x15).'
  }
])

const stats = ref({
  calories: 12500,
  hours: 24,
  achievements: 8,
  avgHeartRate: 142
})

const updateProgress = () => {
  alert('Функция обновления данных прогресса')
}

const editPlan = () => {
  alert('Функция редактирования плана тренировок')
}
</script>

<style scoped>
.stat-card {
  transition: transform .3s ease, box-shadow .3s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, .1);
}
</style>