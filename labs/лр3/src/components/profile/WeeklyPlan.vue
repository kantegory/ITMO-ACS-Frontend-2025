<template>
  <div class="card glass-card">
    <div class="card-body">
      <h2 class="light-blue-text mb-4">
        <svg class="section-icon" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z" fill="currentColor"/></svg>
        Weekly Plan
      </h2>

      <!-- Загрузка -->
      <div v-if="loading" class="text-center py-3">
        <div class="spinner-border text-primary" role="status"></div>
      </div>

      <!-- План на неделю -->
      <div v-else class="weekly-plan">
        <div v-for="(day, index) in weekDays" :key="index" class="day-section">
          <div class="day-header">
            <svg class="mini-icon" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" fill="currentColor"/></svg>
            {{ day.label }}
            <small class="text-muted">({{ day.dateStr }})</small>
          </div>

          <!-- Тренировка на день -->
          <div v-if="day.workout" class="plan-item" :class="{ completed: day.isCompleted }">
            <div class="d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center">
                <div :class="['workout-type-icon', `type-${day.workout.type}`]">
                  <svg class="type-svg" viewBox="0 0 24 24">
                    <path v-if="day.workout.type === 'cardio'" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
                    <path v-else-if="day.workout.type === 'strength'" d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z" fill="currentColor"/>
                    <path v-else-if="day.workout.type === 'yoga'" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                    <path v-else-if="day.workout.type === 'hiit'" d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z" fill="currentColor"/>
                    <path v-else-if="day.workout.type === 'stretching'" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                    <path v-else d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z" fill="currentColor"/>
                  </svg>
                </div>
                <div>
                  <h6 class="mb-1 workout-title">{{ day.workout.name }}</h6>
                  <span class="workout-info">
                    <svg class="info-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
                    {{ day.time }} • {{ getDuration(day.workout.duration) }} •
                    <svg class="info-icon" viewBox="0 0 24 24"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z" fill="currentColor"/></svg>
                    {{ getCalories(day.workout) }} cal
                  </span>
                </div>
              </div>

              <span v-if="day.isCompleted" class="badge bg-success">
                <svg class="badge-icon" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/></svg>
                Done
              </span>
              <router-link v-else :to="`/workouts/${day.workout.id}`" class="btn btn-sm btn-outline-primary">
                <svg class="btn-icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>
                Start
              </router-link>
            </div>
          </div>

          <!-- День отдыха -->
          <div v-else class="plan-item rest-day">
            <div class="d-flex align-items-center">
              <div class="workout-type-icon type-rest">
                <svg class="type-svg" viewBox="0 0 24 24"><path d="M21 10.78V8c0-1.65-1.35-3-3-3h-4c-.77 0-1.47.3-2 .78-.53-.48-1.23-.78-2-.78H6C4.35 5 3 6.35 3 8v2.78c-.61.55-1 1.34-1 2.22v6h2v-2h16v2h2v-6c0-.88-.39-1.67-1-2.22zM14 7h4c.55 0 1 .45 1 1v2h-6V8c0-.55.45-1 1-1zM5 8c0-.55.45-1 1-1h4c.55 0 1 .45 1 1v2H5V8z" fill="currentColor"/></svg>
              </div>
              <div>
                <h6 class="mb-1 rest-title">Rest Day</h6>
                <span class="rest-info">Take time to recover</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Кнопка перехода к тренировкам -->
      <div class="text-center mt-4">
        <router-link to="/workouts" class="btn btn-form-primary">
          <svg class="btn-icon me-2" viewBox="0 0 24 24"><path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z" fill="currentColor"/></svg>
          Browse All Workouts
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useWorkoutsStore } from '@/stores/workouts'

export default {
  name: 'WeeklyPlan',
  setup() {
    const workoutsStore = useWorkoutsStore()
    const loading = ref(true)
    const workouts = ref([])

    const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    const WEEKLY_PLAN = {
      1: { workoutId: 1, time: '07:00 AM' },
      2: { workoutId: 2, time: '06:00 PM' },
      3: { workoutId: 3, time: '07:30 AM' },
      4: { workoutId: 5, time: '06:00 PM' },
      5: { workoutId: 4, time: '07:00 AM' },
      6: { workoutId: 6, time: '10:00 AM' },
      0: null
    }

    const CALORIES_BY_TYPE = {
      'cardio': '300-400', 'strength': '400-500', 'yoga': '200-300',
      'stretching': '150-200', 'hiit': '400-450', 'power-lifting': '500-600', 'default': '300-400'
    }

    const weekDays = computed(() => {
      const today = new Date()
      const currentDay = today.getDay()
      const days = []

      for (let i = 0; i < 7; i++) {
        const dayIndex = (currentDay + i) % 7
        const date = new Date(today)
        date.setDate(today.getDate() + i)

        const plan = WEEKLY_PLAN[dayIndex]
        const workout = plan ? workouts.value.find(w => w.id === plan.workoutId) : null
        const isCompleted = workout ? isWorkoutCompletedOnDate(workout.id, date) : false

        days.push({
          label: i === 0 ? 'Today' : (i === 1 ? 'Tomorrow' : DAYS[dayIndex]),
          dateStr: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          workout,
          time: plan?.time || '',
          isCompleted
        })
      }

      return days
    })

    const isWorkoutCompletedOnDate = (workoutId, date) => {
      const dateStr = date.toDateString()
      return workoutsStore.completedWorkouts.some(cw =>
        cw.id == workoutId && new Date(cw.date).toDateString() === dateStr
      )
    }

    const getDuration = (duration) => {
      const durations = { short: '20 min', medium: '30 min', long: '45 min' }
      return durations[duration] || '30 min'
    }

    const getCalories = (workout) => {
      const type = workout.type?.toLowerCase() || 'default'
      return workout.calories || CALORIES_BY_TYPE[type] || CALORIES_BY_TYPE.default
    }

    onMounted(async () => {
      await workoutsStore.loadWorkouts()
      workoutsStore.loadCompletedWorkouts()
      workouts.value = workoutsStore.workouts
      loading.value = false
    })

    return { loading, weekDays, getDuration, getCalories }
  }
}
</script>

<style scoped>
.section-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
  vertical-align: -4px;
}

.mini-icon {
  width: 14px;
  height: 14px;
  margin-right: 4px;
  vertical-align: -2px;
}

.day-section {
  margin-bottom: 1rem;
}

.day-header {
  font-weight: 600;
  color: var(--theme-primary, #4f86f7);
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--theme-border, #e2e8f0);
}

.plan-item {
  border-left: 4px solid var(--theme-primary, #4f86f7);
  transition: all 0.3s ease;
  padding: 16px;
  background: var(--theme-bg-light, #f8fafc);
  border-radius: 0 8px 8px 0;
}

/* Тёмная тема - контрастные цвета */
[data-theme="dark"] .plan-item {
  background: #1e293b;
}

.plan-item:hover {
  transform: translateX(5px);
}

.plan-item.completed {
  border-left-color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

[data-theme="dark"] .plan-item.completed {
  background: rgba(16, 185, 129, 0.15);
}

.plan-item.rest-day {
  border-left-color: #9ca3af;
  background: var(--theme-bg-light, #f1f5f9);
}

[data-theme="dark"] .plan-item.rest-day {
  background: #1e293b;
}

/* Иконка типа тренировки */
.workout-type-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 14px;
  flex-shrink: 0;
}

.type-svg {
  width: 20px;
  height: 20px;
}

.type-cardio { background: #fecaca; color: #dc2626; }
.type-strength { background: #bfdbfe; color: #2563eb; }
.type-yoga { background: #d9f99d; color: #65a30d; }
.type-hiit { background: #fcd34d; color: #d97706; }
.type-stretching { background: #c4b5fd; color: #7c3aed; }
.type-power-lifting { background: #fda4af; color: #e11d48; }
.type-rest { background: #e5e7eb; color: #6b7280; }

/* Название тренировки - КОНТРАСТНОЕ */
.workout-title {
  font-weight: 700;
  font-size: 1rem;
  color: #1e293b;
  margin: 0;
}

[data-theme="dark"] .workout-title {
  color: #f1f5f9;
}

[data-theme="pink"] .workout-title {
  color: #831843;
}

/* Информация о тренировке - КОНТРАСТНАЯ */
.workout-info {
  font-size: 0.9rem;
  font-weight: 500;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 4px;
}

[data-theme="dark"] .workout-info {
  color: #cbd5e1;
}

[data-theme="pink"] .workout-info {
  color: #9d174d;
}

.info-icon {
  width: 14px;
  height: 14px;
  vertical-align: -2px;
}

/* Rest day */
.rest-title {
  font-weight: 600;
  color: #6b7280;
  margin: 0;
}

[data-theme="dark"] .rest-title {
  color: #9ca3af;
}

.rest-info {
  font-size: 0.85rem;
  color: #9ca3af;
}

[data-theme="dark"] .rest-info {
  color: #6b7280;
}

/* Badge и кнопки */
.badge-icon, .btn-icon {
  width: 14px;
  height: 14px;
  vertical-align: -2px;
}

.btn-icon {
  margin-right: 4px;
}
</style>
