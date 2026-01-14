<template>
  <div class="card glass-card h-100 workout-card">
    <!-- Изображение - полное, без обрезки -->
    <div class="card-img-wrapper">
      <img
        :src="workoutImage"
        :alt="workout.name"
        class="card-img-top"
        @error="handleImageError"
        @load="handleImageLoad"
      >
    </div>

    <div class="card-body d-flex flex-column">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <h5 class="card-title">{{ workout.name }}</h5>
        <span :class="['badge', levelBadgeClass]">{{ workout.level }}</span>
      </div>

      <!-- Описание с поддержкой переносов строк -->
      <p class="card-text flex-grow-1">{{ workout.description }}</p>

      <div class="workout-meta mb-3">
        <div class="meta-item">
          <span class="meta-label">
            <svg class="meta-icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/></svg>
            Type:
          </span>
          <span class="meta-value">{{ workout.type }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">
            <svg class="meta-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
            Duration:
          </span>
          <span class="meta-value">{{ durationText }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">
            <svg class="meta-icon" viewBox="0 0 24 24"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z" fill="currentColor"/></svg>
            Calories:
          </span>
          <span class="meta-value">{{ workout.calories }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">
            <svg class="meta-icon" viewBox="0 0 24 24"><path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z" fill="currentColor"/></svg>
            Equipment:
          </span>
          <span class="meta-value">{{ workout.equipment }}</span>
        </div>
      </div>

      <span v-if="isCompleted" class="badge bg-success mb-3 completed-badge">
        <svg class="badge-icon" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/></svg>
        Completed
      </span>
      <button
        v-else
        class="btn btn-outline-success btn-sm mb-3"
        @click="$emit('markCompleted', workout)"
      >
        <svg class="btn-icon" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/></svg>
        Mark as Completed
      </button>

      <router-link
        :to="`/workouts/${workout.id}`"
        class="btn btn-form-primary mt-auto"
      >
        <svg class="btn-icon" viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" fill="currentColor"/></svg>
        View Details
      </router-link>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'

export default {
  name: 'WorkoutCard',
  props: {
    workout: { type: Object, required: true },
    isCompleted: { type: Boolean, default: false }
  },
  emits: ['markCompleted'],
  setup(props) {
    const imageError = ref(false)
    const imageLoaded = ref(false)

    const workoutImage = computed(() => {
      if (imageError.value) {
        return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80'
      }
      return props.workout.image || `http://localhost:3000/images/${props.workout.type}.jpeg`
    })

    const levelBadgeClass = computed(() => {
      const classes = {
        beginner: 'bg-success',
        intermediate: 'bg-warning text-dark',
        advanced: 'bg-danger'
      }
      return classes[props.workout.level] || 'bg-secondary'
    })

    const durationText = computed(() => {
      const durations = { short: '20 min', medium: '30 min', long: '45 min' }
      return durations[props.workout.duration] || '30 min'
    })

    const handleImageError = () => {
      imageError.value = true
    }

    const handleImageLoad = () => {
      imageLoaded.value = true
    }

    return { workoutImage, levelBadgeClass, durationText, handleImageError, handleImageLoad }
  }
}
</script>

<style scoped>
.workout-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
}

.workout-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

/* Контейнер изображения - показывает ВСЁ изображение */
.card-img-wrapper {
  width: 100%;
  background: linear-gradient(135deg, #f0f4f8, #e2e8f0);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.card-img-top {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.3s ease;
}

.workout-card:hover .card-img-top {
  transform: scale(1.03);
}

.card-title {
  font-weight: 700;
  color: var(--theme-text, #2d3748);
  font-size: 1.1rem;
}

/* Описание с поддержкой переносов строк - БЕЗ изменения цвета */
.card-text {
  white-space: pre-line;
  line-height: 1.6;
}

.workout-meta {
  background: rgba(79, 134, 247, 0.05);
  border-radius: 10px;
  padding: 14px;
}

[data-theme="dark"] .workout-meta {
  background: rgba(79, 134, 247, 0.1);
}

.meta-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.85rem;
}

.meta-item:last-child {
  margin-bottom: 0;
}

.meta-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  color: var(--theme-text-light, #718096);
}

.meta-icon {
  width: 14px;
  height: 14px;
}

.meta-value {
  color: var(--theme-text, #2d3748);
  text-transform: capitalize;
  font-weight: 500;
}

.badge-icon, .btn-icon {
  width: 14px;
  height: 14px;
  margin-right: 4px;
  vertical-align: -2px;
}

.completed-badge {
  padding: 10px 16px;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
