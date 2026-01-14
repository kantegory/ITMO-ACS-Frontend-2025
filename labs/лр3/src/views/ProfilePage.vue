<template>
  <BaseLayout>
    <div class="mb-3"><router-link to="/" class="btn btn-back light-blue-text">← Back to Home</router-link></div>
    <h1 class="form-title mb-4">Your Profile</h1>
    <div class="row">
      <div class="col-md-4">
        <UserInfo :user="user" :is-authenticated="isAuthenticated" :completed-count="completedCount" @logout="logout" />
        <CompletedWorkoutsList :workouts="completedWorkouts" />
      </div>
      <div class="col-md-8">
        <ProgressStats :completed-count="completedCount" :progress-percentage="progressPercentage" :total-calories="totalCaloriesBurned" />
        <WeeklyPlan />
      </div>
    </div>
  </BaseLayout>
</template>

<script>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import BaseLayout from '@/layouts/BaseLayout.vue'
import UserInfo from '@/components/profile/UserInfo.vue'
import ProgressStats from '@/components/profile/ProgressStats.vue'
import CompletedWorkoutsList from '@/components/profile/CompletedWorkoutsList.vue'
import WeeklyPlan from '@/components/profile/WeeklyPlan.vue'
import { useAuth } from '@/composables/useAuth'
import { useWorkoutsStore } from '@/stores/workouts'

export default {
  name: 'ProfilePage',
  components: { BaseLayout, UserInfo, ProgressStats, CompletedWorkoutsList, WeeklyPlan },
  setup() {
    const { user, isAuthenticated, logout } = useAuth()
    const workoutsStore = useWorkoutsStore()
    const { completedWorkouts, completedCount, progressPercentage, totalCaloriesBurned } = storeToRefs(workoutsStore)
    onMounted(() => workoutsStore.loadCompletedWorkouts())
    return { user, isAuthenticated, logout, completedWorkouts, completedCount, progressPercentage, totalCaloriesBurned }
  }
}
</script>
