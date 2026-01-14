<template>
  <div class="workout-stats mb-4">
    <div class="row">
      <div class="col-md-3 col-6 text-center p-3">
        <div class="fs-4 fw-bold text-primary">{{ durationMinutes }}</div>
        <div class="text-muted small">Duration</div>
      </div>
      <div class="col-md-3 col-6 text-center p-3">
        <div class="fs-4 fw-bold text-primary">{{ workout.calories || '300-400' }}</div>
        <div class="text-muted small">Calories</div>
      </div>
      <div class="col-md-3 col-6 text-center p-3">
        <div class="fs-4 fw-bold text-primary text-capitalize">{{ workout.level }}</div>
        <div class="text-muted small">Level</div>
      </div>
      <div class="col-md-3 col-6 text-center p-3">
        <div class="fs-4 fw-bold text-primary text-capitalize">{{ workout.type }}</div>
        <div class="text-muted small">Type</div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
export default {
  name: 'WorkoutStats',
  props: { workout: { type: Object, required: true } },

 setup(props) {
    const durationMinutes = computed(() => ({ short: '20 min', medium: '30 min', long: '45 min' })[props.workout.duration] || '30 min')
    return { durationMinutes }
  }
}
</script>

<style scoped>
.workout-stats { background: rgba(79, 134, 247, 0.05); border-radius: 10px; }
</style>
