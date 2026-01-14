<template>
  <div class="card glass-card mb-4">
    <div class="card-body">
      <h2 class="light-blue-text mb-4">Progress Tracking</h2>
      <div class="row mb-4">
        <div class="col-md-6">
          <h6>Workouts Completed</h6>
          <div class="progress mb-2">
            <div class="progress-bar" :style="{ width: progressPercentage + '%' }">{{ completedCount }}/10</div>
          </div>
        </div>
        <div class="col-md-6">
          <h6>Calories Burned</h6>
          <div class="progress mb-2">
            <div class="progress-bar bg-success" :style="{ width: caloriesPercentage + '%' }">{{ totalCalories }}/7500</div>
          </div>
        </div>
      </div>
      <h6 class="mb-3">Recent Achievements</h6>
      <div class="row">
        <div class="col-4 text-center"><span style="font-size: 2rem;">🏆</span><br><small>First Workout</small></div>
        <div class="col-4 text-center"><span style="font-size: 2rem;">🔥</span><br><small>5 Workouts</small></div>
        <div class="col-4 text-center"><span style="font-size: 2rem;">⭐</span><br><small>Week Streak</small></div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
export default {
  name: 'ProgressStats',
  props: { completedCount: Number, progressPercentage: Number, totalCalories: Number },
  setup(props) {
    const caloriesPercentage = computed(() => Math.min(100, Math.round((props.totalCalories / 7500) * 100)))
    return { caloriesPercentage }
  }
}
</script>

<style scoped>
.progress { height: 20px; }
</style>
