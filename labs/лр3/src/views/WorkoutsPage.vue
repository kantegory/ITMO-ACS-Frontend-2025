<template>
  <BaseLayout>
    <div class="mb-3"><router-link to="/" class="btn btn-back light-blue-text">← Back to Home</router-link></div>
    <h1 class="form-title mb-4">Workouts</h1>
    <WorkoutFilters v-model:filters="filters" @apply="applyFilters" @reset="resetFilters" />
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;"></div>
      <p class="mt-3">Loading workouts...</p>
    </div>
    <div v-else-if="error" class="alert alert-warning">{{ error }}<button class="btn btn-sm btn-warning ms-3" @click="loadData">Try Again</button></div>
    <div v-else class="row g-4">
      <div v-for="workout in filteredWorkouts" :key="workout.id" class="col-md-6">
        <WorkoutCard :workout="workout" :is-completed="isWorkoutCompleted(workout.id)" @mark-completed="handleMarkCompleted" />
      </div>
      <div v-if="filteredWorkouts.length === 0" class="col-12">
        <div class="alert alert-info text-center">No workouts found. <button class="btn btn-sm btn-info" @click="resetFilters">Reset Filters</button></div>
      </div>
    </div>
  </BaseLayout>
</template>

<script>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import BaseLayout from '@/layouts/BaseLayout.vue'
import WorkoutCard from '@/components/workouts/WorkoutCard.vue'
import WorkoutFilters from '@/components/workouts/WorkoutFilters.vue'
import { useWorkoutsStore } from '@/stores/workouts'
import { useNotification } from '@/composables/useNotification'

export default {
  name: 'WorkoutsPage',
  components: { BaseLayout, WorkoutCard, WorkoutFilters },
  setup() {
    const workoutsStore = useWorkoutsStore()
    const { success, error: showError } = useNotification()
    const { filteredWorkouts, loading, error, filters } = storeToRefs(workoutsStore)
    const isWorkoutCompleted = (id) => workoutsStore.isWorkoutCompleted(id)
    const loadData = async () => { await workoutsStore.loadWorkouts(); workoutsStore.loadCompletedWorkouts() }
    const applyFilters = () => {}
    const resetFilters = () => workoutsStore.resetFilters()
    const handleMarkCompleted = async (w) => { const r = await workoutsStore.markAsCompleted(w); r.success ? success(r.message) : showError(r.message) }
    onMounted(loadData)
    return { filteredWorkouts, loading, error, filters, isWorkoutCompleted, loadData, applyFilters, resetFilters, handleMarkCompleted }
  }
}
</script>
