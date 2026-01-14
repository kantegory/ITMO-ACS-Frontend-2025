<template>
  <div class="card glass-card h-100">
    <img :src="workoutImage" :alt="workout.name" class="card-img-top" @error="handleImageError">
    <div class="card-body d-flex flex-column">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <h5 class="card-title">{{ workout.name }}</h5>
        <span :class="['badge', levelBadgeClass]">{{ workout.level }}</span>
      </div>
      <p class="card-text flex-grow-1">{{ workout.description }}</p>
      <div class="mb-3">
        <small class="d-block"><strong>Type:</strong> {{ workout.type }}</small>
        <small class="d-block"><strong>Duration:</strong> {{ durationText }}</small>
        <small class="d-block"><strong>Calories:</strong> {{ workout.calories }}</small>
      </div>
      <span v-if="isCompleted" class="badge bg-success mb-3">Completed</span>
      <button v-else class="btn btn-outline-success btn-sm mb-3" @click="$emit('markCompleted', workout)">Mark as Completed</button>
      <router-link :to="`/workouts/${workout.id}`" class="btn btn-form-primary mt-auto">View Details</router-link>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
export default {
  name: 'WorkoutCard',
  props: { workout: { type: Object, required: true }, isCompleted: { type: Boolean, default: false } },
  emits: ['markCompleted'],
  setup(props) {
    const imageError = ref(false)
    const workoutImage = computed(() => imageError.value ? 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=250&fit=crop' : props.workout.image || `http://localhost:3000/images/${props.workout.type}.jpeg`)
    const levelBadgeClass = computed(() => ({ beginner: 'bg-success', intermediate: 'bg-warning text-dark', advanced: 'bg-danger' })[props.workout.level] || 'bg-secondary')
    const durationText = computed(() => ({ short: '20 min', medium: '30 min', long: '45 min' })[props.workout.duration] || '30 min')
    const handleImageError = () => { imageError.value = true }
    return { workoutImage, levelBadgeClass, durationText, handleImageError }
  }
}
</script>

<style scoped>
.card-img-top { height: 200px; object-fit: cover; }
</style>
