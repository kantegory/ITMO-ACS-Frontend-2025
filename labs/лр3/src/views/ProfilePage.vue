<template>
  <BaseLayout>
    <div class="mb-3">
      <router-link to="/" class="btn btn-back light-blue-text">
        ← Back to Home
      </router-link>
    </div>

    <header class="mb-4">
      <h1 class="form-title">Your Profile</h1>
      <p class="text-muted text-center">Track your fitness progress, completed workouts, and achievements</p>
    </header>

    <div class="row">
      <!-- Левая колонка -->
      <div class="col-md-4">
        <UserInfo 
          :user="user"
          :is-authenticated="isAuthenticated"
          :completed-count="completedCount"
          @logout="logout"
        />
        <CompletedWorkoutsList :workouts="completedWorkouts" />
      </div>

      <!-- Правая колонка -->
      <div class="col-md-8">
        <ProgressStats 
          :completed-count="completedCount"
          :progress-percentage="progressPercentage"
          :total-calories="totalCaloriesBurned"
        />
        <WeeklyPlan />
      </div>
    </div>
  </BaseLayout>
</template>

<script>
import { onMounted, computed } from 'vue'
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
  components: {
    BaseLayout,
    UserInfo,
    ProgressStats,
    CompletedWorkoutsList,
    WeeklyPlan
  },
  setup() {
    const { user, isAuthenticated, logout } = useAuth()
    const workoutsStore = useWorkoutsStore()
    
    const { completedWorkouts } = storeToRefs(workoutsStore)

    const completedCount = computed(() => completedWorkouts.value.length)
    
    const progressPercentage = computed(() => 
      Math.min(100, Math.round((completedCount.value / 10) * 100))
    )

    const totalCaloriesBurned = computed(() => {
      const caloriesByType = {
        'cardio': 350, 'strength': 450, 'yoga': 250,
        'stretching': 175, 'hiit': 425, 'power-lifting': 550, 'default': 300
      }
      
      return completedWorkouts.value.reduce((total, w) => {
        if (w.calories) return total + parseInt(w.calories)
        const type = w.type?.toLowerCase() || 'default'
        return total + (caloriesByType[type] || caloriesByType.default)
      }, 0)
    })

    onMounted(() => {
      workoutsStore.loadCompletedWorkouts()
    })

    return {
      user,
      isAuthenticated,
      logout,
      completedWorkouts,
      completedCount,
      progressPercentage,
      totalCaloriesBurned
    }
  }
}
</script>
