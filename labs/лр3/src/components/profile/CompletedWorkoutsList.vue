<template>
  <div class="card glass-card">
    <div class="card-body">
      <h3 class="light-blue-text mb-3">
        <svg class="section-icon" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/></svg>
        Completed Workouts
      </h3>
      
      <!-- Пустой список -->
      <div v-if="workouts.length === 0" class="empty-state">
        <svg class="empty-icon" viewBox="0 0 24 24"><path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z" fill="currentColor"/></svg>
        <p class="text-muted mt-2">No completed workouts yet.</p>
        <router-link to="/workouts" class="btn btn-sm btn-form-primary">
          Browse Workouts
        </router-link>
      </div>

      <!-- Список тренировок -->
      <div v-else class="workouts-list">
        <div 
          v-for="workout in sortedWorkouts" 
          :key="workout.id + '-' + workout.date" 
          class="completed-workout-item"
        >
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <h6 class="workout-name">
                <svg class="mini-icon" viewBox="0 0 24 24"><path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z" fill="currentColor"/></svg>
                {{ workout.name || 'Workout' }}
                <small class="calories-info">
                  <svg class="mini-icon" viewBox="0 0 24 24"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z" fill="currentColor"/></svg>
                  {{ getCalories(workout) }} cal
                </small>
              </h6>
              <small class="workout-date">
                <svg class="mini-icon" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" fill="currentColor"/></svg>
                {{ formatDate(workout.date) }}
              </small>
            </div>
            <span :class="['level-badge', `level-${workout.level || 'beginner'}`]">
              {{ workout.level || 'beginner' }}
            </span>
          </div>
        </div>
        
        <!-- Показать больше -->
        <div v-if="workouts.length > 10" class="text-center mt-2">
          <small class="text-muted">Showing 10 of {{ workouts.length }} workouts</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'CompletedWorkoutsList',
  props: {
    workouts: { type: Array, default: () => [] }
  },
  setup(props) {
    const CALORIES_BY_TYPE = {
      'cardio': 350, 'strength': 450, 'yoga': 250,
      'stretching': 175, 'hiit': 425, 'power-lifting': 550, 'default': 300
    }

    const sortedWorkouts = computed(() => 
      [...props.workouts]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10)
    )

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      const now = new Date()
      const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) return 'Today'
      if (diffDays === 1) return 'Yesterday'
      if (diffDays < 7) return `${diffDays} days ago`
      
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    const getCalories = (workout) => {
      if (workout.calories) return workout.calories
      const type = workout.type?.toLowerCase() || 'default'
      return CALORIES_BY_TYPE[type] || CALORIES_BY_TYPE.default
    }

    return { sortedWorkouts, formatDate, getCalories }
  }
}
</script>

<style scoped>
.section-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  vertical-align: -3px;
}

.mini-icon {
  width: 12px;
  height: 12px;
  margin-right: 4px;
  vertical-align: -1px;
}

.empty-state {
  text-align: center;
  padding: 20px;
}

.empty-icon {
  width: 3rem;
  height: 3rem;
  color: #dee2e6;
}

.completed-workout-item {
  background: rgba(79, 134, 247, 0.05);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
  border-left: 3px solid var(--theme-primary, #4f86f7);
  transition: all 0.2s ease;
}

.completed-workout-item:hover {
  background: rgba(79, 134, 247, 0.1);
  transform: translateX(3px);
}

.workout-name {
  margin-bottom: 4px;
  font-size: 0.95rem;
}

.calories-info {
  color: var(--theme-text-light, #718096);
  margin-left: 8px;
}

.workout-date {
  color: var(--theme-text-light, #718096);
  font-size: 0.8rem;
}

.level-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: capitalize;
}

.level-beginner { background: #10b981; color: white; }
.level-intermediate { background: #f59e0b; color: white; }
.level-advanced { background: #ef4444; color: white; }
</style>
