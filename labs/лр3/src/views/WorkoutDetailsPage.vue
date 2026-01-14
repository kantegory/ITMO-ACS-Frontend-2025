<template>
  <BaseLayout>
    <div class="mb-3">
      <router-link to="/workouts" class="btn btn-back light-blue-text">← Back to Workouts</router-link>
      <router-link to="/" class="btn btn-back light-blue-text ms-2">Home</router-link>
    </div>
    <div v-if="loading" class="text-center py-5"><div class="spinner-border text-primary"></div><p class="mt-2">Loading...</p></div>
    <div v-else-if="workout">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="form-title mb-0">{{ workout.name }}</h2>
        <button class="btn" :class="isCompleted ? 'btn-success' : 'btn-outline-success'" :disabled="isCompleted" @click="handleMarkCompleted">{{ isCompleted ? 'Completed' : 'Mark Complete' }}</button>
      </div>
      <WorkoutStats :workout="workout" />
      <div class="card glass-card">
        <div class="card-body">
          <p class="fs-5 mb-4">{{ workout.description }}</p>
          <div class="mb-4" style="height: 300px; overflow: hidden; border-radius: 10px;">
            <img :src="workoutImage" :alt="workout.name" style="width: 100%; height: 100%; object-fit: cover;" @error="handleImageError">
          </div>
          <WorkoutInstructions :type="workout.type" :level="workout.level" />
        </div>
      </div>
    </div>
    <div v-else class="alert alert-danger">Workout not found <router-link to="/workouts" class="btn btn-sm btn-outline-danger ms-3">Back</router-link></div>
  </BaseLayout>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import BaseLayout from '@/layouts/BaseLayout.vue'
import WorkoutStats from '@/components/workouts/WorkoutStats.vue'
import WorkoutInstructions from '@/components/workouts/WorkoutInstructions.vue'
import { useWorkoutsStore } from '@/stores/workouts'
import { useNotification } from '@/composables/useNotification'

export default {
  name: 'WorkoutDetailsPage',
  components: { BaseLayout, WorkoutStats, WorkoutInstructions },
  setup() {
    const route = useRoute()
    const workoutsStore = useWorkoutsStore()
    const { success } = useNotification()
    const workout = ref(null)
    const loading = ref(true)
    const imageError = ref(false)
    const isCompleted = computed(() => workout.value ? workoutsStore.isWorkoutCompleted(workout.value.id) : false)
    const workoutImage = computed(() => imageError.value ? 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=400&fit=crop' : workout.value?.image || `http://localhost:3000/images/${workout.value?.type}.jpeg`)
    const loadWorkout = async () => { loading.value = true; workout.value = await workoutsStore.loadWorkoutById(route.params.id); workoutsStore.loadCompletedWorkouts(); loading.value = false }
    const handleMarkCompleted = async () => { if (!workout.value || isCompleted.value) return; const r = await workoutsStore.markAsCompleted(workout.value); if (r.success) success(r.message) }
    const handleImageError = () => { imageError.value = true }
    onMounted(loadWorkout)
    return { workout, loading, isCompleted, workoutImage, handleMarkCompleted, handleImageError }
  }
}
</script>
