<template>
  <BaseLayout>
    <div class="mb-3">
      <router-link to="/workouts" class="btn btn-back light-blue-text">
        <svg class="btn-icon" viewBox="0 0 24 24" width="16" height="16">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="currentColor"/>
        </svg>
        Back to Workouts
      </router-link>
      <router-link to="/" class="btn btn-back light-blue-text ms-2">
        <svg class="btn-icon" viewBox="0 0 24 24" width="16" height="16">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor"/>
        </svg>
        Home
      </router-link>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
      <p class="mt-2">Loading workout details...</p>
    </div>

    <div v-else-if="workout">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="form-title mb-0">{{ workout.name }}</h2>
        <button
          class="btn"
          :class="isCompleted ? 'btn-success' : 'btn-outline-success'"
          :disabled="isCompleted"
          @click="handleMarkCompleted"
        >
          <svg class="btn-icon" viewBox="0 0 24 24" width="16" height="16">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/>
          </svg>
          {{ isCompleted ? 'Completed!' : 'Mark Complete' }}
        </button>
      </div>

      <!-- Stats -->
      <WorkoutStats :workout="workout" />

      <!-- Main Content Card -->
      <div class="card glass-card">
        <div class="card-body">
          <!-- Горизонтальный layout: картинка слева, контент справа -->
          <div class="workout-detail-layout">
            <!-- Картинка слева (меньше) -->
            <div class="workout-image-section">
              <div class="workout-image-container">
                <img
                  :src="workoutImage"
                  :alt="workout.name"
                  class="workout-detail-image"
                  @error="handleImageError"
                >
                <span :class="['level-badge', `level-${workout.level}`]">
                  {{ workout.level }}
                </span>
              </div>

              <!-- Quick Stats под картинкой -->
              <div class="quick-stats">
                <div class="quick-stat">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                    <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
                  </svg>
                  <span>{{ durationText }}</span>
                </div>
                <div class="quick-stat">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z" fill="currentColor"/>
                  </svg>
                  <span>{{ workout.calories }} cal</span>
                </div>
                <div class="quick-stat">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z" fill="currentColor"/>
                  </svg>
                  <span>{{ workout.equipment }}</span>
                </div>
              </div>
            </div>

            <!-- Контент справа -->
            <div class="workout-content-section">
              <div class="content-header">
                <span class="workout-type-badge">{{ workout.type }}</span>
                <span v-if="isCompleted" class="completed-indicator">
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/>
                  </svg>
                  You've completed this workout!
                </span>
              </div>

              <h3 class="content-title">About This Workout</h3>
              <p class="workout-description">{{ workout.description }}</p>

              <!-- Дополнительная информация -->
              <div class="workout-benefits">
                <h4>What You'll Achieve</h4>
                <ul class="benefits-list">
                  <li v-for="benefit in workoutBenefits" :key="benefit">
                    <svg viewBox="0 0 24 24" width="16" height="16">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/>
                    </svg>
                    {{ benefit }}
                  </li>
                </ul>
              </div>

              <div class="workout-tips">
                <h4>Pro Tips</h4>
                <p>{{ workoutTip }}</p>
              </div>
            </div>
          </div>

          <!-- Instructions (full width below) -->
          <WorkoutInstructions :type="workout.type" :level="workout.level" />
        </div>
      </div>
    </div>

    <div v-else class="alert alert-danger">
      <svg class="me-2" viewBox="0 0 24 24" width="20" height="20">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
      </svg>
      Workout not found
      <router-link to="/workouts" class="btn btn-sm btn-outline-danger ms-3">Back to Workouts</router-link>
    </div>
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

    const isCompleted = computed(() =>
      workout.value ? workoutsStore.isWorkoutCompleted(workout.value.id) : false
    )

    const workoutImage = computed(() => {
      if (imageError.value) {
        return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=400&fit=crop'
      }
      return workout.value?.image || `http://localhost:3000/images/${workout.value?.type}.jpeg`
    })

    const durationText = computed(() => {
      const durations = { short: '20 min', medium: '30 min', long: '45 min' }
      return durations[workout.value?.duration] || '30 min'
    })

    // Динамические benefits в зависимости от типа тренировки
    const workoutBenefits = computed(() => {
      const benefits = {
        strength: [
          'Build lean muscle mass and definition',
          'Increase overall body strength',
          'Boost metabolism for fat burning',
          'Improve bone density and joint health'
        ],
        cardio: [
          'Improve cardiovascular endurance',
          'Burn calories effectively',
          'Boost energy levels throughout the day',
          'Reduce stress and improve mood'
        ],
        flexibility: [
          'Increase range of motion',
          'Reduce muscle tension and stiffness',
          'Improve posture and balance',
          'Prevent injuries during workouts'
        ],
        hiit: [
          'Maximum calorie burn in minimum time',
          'Boost metabolism for hours after workout',
          'Build both strength and endurance',
          'Improve athletic performance'
        ],
        yoga: [
          'Enhance mind-body connection',
          'Reduce stress and anxiety',
          'Improve flexibility and balance',
          'Build core strength naturally'
        ]
      }
      return benefits[workout.value?.type] || benefits.strength
    })

    const workoutTip = computed(() => {
      const tips = {
        strength: 'Focus on proper form over heavy weights. Start with lighter weights to master the movement, then progressively increase. Rest 60-90 seconds between sets for optimal muscle recovery.',
        cardio: 'Keep a steady pace you can maintain throughout. If you can\'t hold a conversation, slow down slightly. Stay hydrated and listen to your body.',
        flexibility: 'Never bounce during stretches - hold each position steadily. Breathe deeply and relax into each stretch. Consistency is more important than intensity.',
        hiit: 'Give 100% effort during work intervals, then fully rest during recovery periods. Quality over quantity - maintain good form even when tired.',
        yoga: 'Focus on your breath - it guides the practice. Don\'t compare yourself to others. Every body is different, honor where you are today.'
      }
      return tips[workout.value?.type] || tips.strength
    })

    const loadWorkout = async () => {
      loading.value = true
      workout.value = await workoutsStore.loadWorkoutById(route.params.id)
      workoutsStore.loadCompletedWorkouts()
      loading.value = false
    }

    const handleMarkCompleted = async () => {
      if (!workout.value || isCompleted.value) return
      const result = await workoutsStore.markAsCompleted(workout.value)
      if (result.success) success(result.message)
    }

    const handleImageError = () => {
      imageError.value = true
    }

    onMounted(loadWorkout)

    return {
      workout,
      loading,
      isCompleted,
      workoutImage,
      durationText,
      workoutBenefits,
      workoutTip,
      handleMarkCompleted,
      handleImageError
    }
  }
}
</script>

<style scoped>
.btn-icon {
  margin-right: 6px;
  vertical-align: -2px;
}

/* Горизонтальный layout */
.workout-detail-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 30px;
  margin-bottom: 30px;
}

@media (max-width: 768px) {
  .workout-detail-layout {
    grid-template-columns: 1fr;
  }
}

/* Секция с картинкой (левая) */
.workout-image-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.workout-image-container {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.workout-detail-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.level-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.level-beginner {
  background: rgba(72, 187, 120, 0.9);
  color: white;
}

.level-intermediate {
  background: rgba(237, 137, 54, 0.9);
  color: white;
}

.level-advanced {
  background: rgba(245, 101, 101, 0.9);
  color: white;
}

/* Quick stats под картинкой */
.quick-stats {
  background: rgba(79, 134, 247, 0.08);
  border-radius: 10px;
  padding: 12px;
}

[data-theme="dark"] .quick-stats {
  background: rgba(79, 134, 247, 0.15);
}

.quick-stat {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(79, 134, 247, 0.1);
  font-size: 0.9rem;
  color: var(--theme-text, #2d3748);
}

.quick-stat:last-child {
  border-bottom: none;
}

.quick-stat svg {
  color: #4f86f7;
  flex-shrink: 0;
}

.quick-stat span {
  text-transform: capitalize;
}

/* Секция с контентом (правая) */
.workout-content-section {
  display: flex;
  flex-direction: column;
}

.content-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.workout-type-badge {
  background: linear-gradient(135deg, #4f86f7, #3b6dd8);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: capitalize;
}

.completed-indicator {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #48bb78;
  font-size: 0.85rem;
  font-weight: 500;
}

.content-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--theme-text, #2d3748);
  margin-bottom: 10px;
}

.workout-description {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--theme-text-light, #4a5568);
  margin-bottom: 20px;
}

/* Benefits */
.workout-benefits {
  background: linear-gradient(135deg, rgba(72, 187, 120, 0.08), rgba(72, 187, 120, 0.03));
  border-radius: 12px;
  padding: 15px 20px;
  margin-bottom: 15px;
}

[data-theme="dark"] .workout-benefits {
  background: linear-gradient(135deg, rgba(72, 187, 120, 0.15), rgba(72, 187, 120, 0.08));
}

.workout-benefits h4 {
  font-size: 0.95rem;
  font-weight: 700;
  color: #48bb78;
  margin-bottom: 12px;
}

.benefits-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
}

.benefits-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: var(--theme-text, #2d3748);
}

.benefits-list svg {
  color: #48bb78;
  flex-shrink: 0;
}

/* Tips */
.workout-tips {
  background: linear-gradient(135deg, rgba(79, 134, 247, 0.08), rgba(79, 134, 247, 0.03));
  border-radius: 12px;
  padding: 15px 20px;
  border-left: 3px solid #4f86f7;
}

[data-theme="dark"] .workout-tips {
  background: linear-gradient(135deg, rgba(79, 134, 247, 0.15), rgba(79, 134, 247, 0.08));
}

.workout-tips h4 {
  font-size: 0.95rem;
  font-weight: 700;
  color: #4f86f7;
  margin-bottom: 8px;
}

.workout-tips p {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--theme-text-light, #4a5568);
  margin: 0;
}
</style>
