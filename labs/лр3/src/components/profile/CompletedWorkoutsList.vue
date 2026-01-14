<template>
  <div class="card glass-card">
    <div class="card-body">
      <h3 class="light-blue-text mb-3">Completed Workouts</h3>
      <div v-if="workouts.length === 0" class="text-center py-4">
        <span style="font-size: 3rem;">🏋️</span>
        <p class="text-muted mt-2">No completed workouts yet.</p>
        <router-link to="/workouts" class="btn btn-sm btn-form-primary">Browse Workouts</router-link>
      </div>
      <div v-else>
        <div v-for="workout in sortedWorkouts" :key="workout.id + workout.date" class="p-2 mb-2 bg-light rounded border-start border-primary border-3">
          <div class="d-flex justify-content-between">
            <div>
              <strong>{{ workout.name }}</strong>
              <br><small class="text-muted">{{ formatDate(workout.date) }}</small>
            </div>
            <span :class="['badge', `bg-${levelColor(workout.level)}`]">{{ workout.level }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
export default {
  name: 'CompletedWorkoutsList',
  props: { workouts: { type: Array, default: () => [] } },
  setup(props) {
    const sortedWorkouts = computed(() => [...props.workouts].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10))
    const formatDate = (d) => {
      const date = new Date(d)
      const diff = Math.floor((new Date() - date) / 86400000)
      if (diff === 0) return 'Today'
      if (diff === 1) return 'Yesterday'
      if (diff < 7) return `${diff} days ago`
      return date.toLocaleDateString()
    }
    const levelColor = (l) => ({ beginner: 'success', intermediate: 'warning', advanced: 'danger' })[l] || 'secondary'
    return { sortedWorkouts, formatDate, levelColor }
  }
}
</script>
