<template>
  <div class="card glass-card mb-4">
    <div class="card-body">
      <h2 class="light-blue-text mb-4">
        <svg class="section-icon" viewBox="0 0 24 24"><path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" fill="currentColor"/></svg>
        Progress Tracking
      </h2>

      <!-- Прогресс бары -->
      <div class="row mb-4">
        <div class="col-md-6 mb-3">
          <h6 class="progress-title">
            🏋️ Workouts Completed
          </h6>
          <div class="progress mb-2">
            <div
              class="progress-bar"
              :style="{ width: Math.max(progressPercentage, 15) + '%' }"
            >
              {{ completedCount }}/10
            </div>
          </div>
          <small class="text-muted">{{ completedCount }} workouts completed</small>
        </div>

        <div class="col-md-6 mb-3">
          <h6 class="progress-title">
            🔥 Calories Burned
          </h6>
          <div class="progress mb-2">
            <div
              class="progress-bar bg-success"
              :style="{ width: Math.max(caloriesPercentage, 15) + '%' }"
            >
              {{ totalCalories }}/7500
            </div>
          </div>
          <small class="text-muted">Weekly goal: 7500 calories</small>
        </div>
      </div>

      <!-- Достижения -->
      <h6 class="mb-3">🏆 Recent Achievements</h6>

      <div class="row">
        <div class="col-md-4 mb-3">
          <div class="achievement-item" :class="{ unlocked: completedCount >= 1 }">
            <div class="achievement-icon-wrapper">
              <span class="achievement-emoji">🏆</span>
            </div>
            <div class="achievement-text">
              <span class="achievement-title">First Workout</span>
              <span class="achievement-desc">Complete your first workout</span>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="achievement-item" :class="{ unlocked: completedCount >= 5 }">
            <div class="achievement-icon-wrapper">
              <span class="achievement-emoji">🔥</span>
            </div>
            <div class="achievement-text">
              <span class="achievement-title">5 Workouts</span>
              <span class="achievement-desc">Complete 5 workouts</span>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="achievement-item" :class="{ unlocked: completedCount >= 7 }">
            <div class="achievement-icon-wrapper">
              <span class="achievement-emoji">⭐</span>
            </div>
            <div class="achievement-text">
              <span class="achievement-title">Week Streak</span>
              <span class="achievement-desc">7 days in a row</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'ProgressStats',
  props: {
    completedCount: { type: Number, default: 0 },
    progressPercentage: { type: Number, default: 0 },
    totalCalories: { type: Number, default: 0 }
  },
  setup(props) {
    const caloriesPercentage = computed(() =>
      Math.min(100, Math.round((props.totalCalories / 7500) * 100))
    )
    return { caloriesPercentage }
  }
}
</script>

<style scoped>
.section-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
  vertical-align: -4px;
}

.progress-title {
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.progress {
  height: 24px;
  background-color: rgba(79, 134, 247, 0.1);
  border-radius: 12px;
  overflow: hidden;
}

.progress-bar {
  background: linear-gradient(90deg, var(--theme-primary, #4f86f7), var(--theme-accent, #38b2ac));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: white;
  transition: width 0.5s ease;
  min-width: 60px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

.progress-bar.bg-success {
  background: linear-gradient(90deg, #10b981, #34d399);
}

/* Достижения - центрированные */
.achievement-item {
  padding: 20px 15px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(79, 134, 247, 0.05), rgba(56, 178, 172, 0.05));
  border: 2px solid rgba(79, 134, 247, 0.1);
  text-align: center;
  transition: all 0.3s ease;
  opacity: 0.5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 140px;
}

.achievement-item.unlocked {
  opacity: 1;
  background: linear-gradient(135deg, rgba(79, 134, 247, 0.15), rgba(56, 178, 172, 0.15));
  border-color: rgba(79, 134, 247, 0.3);
}

.achievement-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(79, 134, 247, 0.2);
}

.achievement-icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(79, 134, 247, 0.1), rgba(56, 178, 172, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.achievement-emoji {
  font-size: 2rem;
  line-height: 1;
}

.achievement-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.achievement-title {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--theme-text, #2d3748);
}

.achievement-desc {
  font-size: 0.75rem;
  color: var(--theme-text-light, #718096);
}
</style>
