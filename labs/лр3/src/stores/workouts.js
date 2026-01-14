import { defineStore } from 'pinia'
import { workoutsApi } from '@/api'

export const useWorkoutsStore = defineStore('workouts', {
  state: () => ({
    workouts: [],
    completedWorkouts: [],
    currentWorkout: null,
    loading: false,
    error: null,
    filters: {
      type: 'all',
      level: 'all',
      duration: 'all'
    }
  }),

  getters: {
    filteredWorkouts: (state) => {
      let result = [...state.workouts]
      if (state.filters.type !== 'all') {
        result = result.filter(w => w.type === state.filters.type)
      }
      if (state.filters.level !== 'all') {
        result = result.filter(w => w.level === state.filters.level)
      }
      if (state.filters.duration !== 'all') {
        result = result.filter(w => w.duration === state.filters.duration)
      }
      return result
    },

    completedCount: (state) => state.completedWorkouts.length,

    isWorkoutCompleted: (state) => (workoutId) => {
      return state.completedWorkouts.some(w => w.id == workoutId)
    },

    progressPercentage: (state) => {
      const goal = 10
      return Math.min(100, Math.round((state.completedWorkouts.length / goal) * 100))
    },

    totalCaloriesBurned: (state) => {
      const caloriesByType = {
        'cardio': 350, 'strength': 450, 'yoga': 250,
        'stretching': 175, 'hiit': 425, 'power-lifting': 550, 'default': 300
      }
      return state.completedWorkouts.reduce((total, w) => {
        if (w.calories) return total + parseInt(w.calories)
        const type = w.type?.toLowerCase() || 'default'
        return total + (caloriesByType[type] || caloriesByType.default)
      }, 0)
    }
  },

  actions: {
    async loadWorkouts() {
      this.loading = true
      this.error = null
      try {
        const response = await workoutsApi.getAll()
        this.workouts = response.data
      } catch (error) {
        this.error = 'Failed to load workouts'
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    async loadWorkoutById(id) {
      this.loading = true
      this.error = null
      try {
        const response = await workoutsApi.getById(id)
        this.currentWorkout = response.data
        return response.data
      } catch (error) {
        this.error = 'Failed to load workout'
        return null
      } finally {
        this.loading = false
      }
    },

    loadCompletedWorkouts() {
      const completed = JSON.parse(localStorage.getItem('completedWorkouts')) || []
      this.completedWorkouts = completed
    },

    async markAsCompleted(workout) {
      const exists = this.completedWorkouts.find(w => w.id == workout.id)
      if (exists) {
        return { success: false, message: 'Already completed!' }
      }
      const completed = {
        id: workout.id,
        name: workout.name,
        level: workout.level,
        type: workout.type,
        date: new Date().toISOString()
      }
      this.completedWorkouts.push(completed)
      localStorage.setItem('completedWorkouts', JSON.stringify(this.completedWorkouts))
      return { success: true, message: 'Workout marked as completed!' }
    },

    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
    },

    resetFilters() {
      this.filters = { type: 'all', level: 'all', duration: 'all' }
    }
  },

  persist: {
    paths: ['completedWorkouts']
  }
})
