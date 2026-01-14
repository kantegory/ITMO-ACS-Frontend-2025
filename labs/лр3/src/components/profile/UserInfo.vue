<template>
  <div class="card glass-card mb-4">
    <div class="card-body text-center">
      <!-- Аватар -->
      <div class="user-avatar mb-3">
        <div class="avatar-placeholder">
          <svg class="avatar-icon" viewBox="0 0 24 24">
            <path class="avatar-path" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
      </div>
      
      <!-- Имя пользователя -->
      <h2 class="light-blue-text">{{ displayName }}</h2>
      <p class="text-muted">{{ isAuthenticated ? 'Fitness Enthusiast' : 'Guest User' }}</p>
      
      <!-- Статистика -->
      <div class="user-stats">
        <div class="row text-center">
          <div class="col-4 stat-col">
            <div class="h5 light-blue-text">
              <svg class="stat-icon" viewBox="0 0 24 24"><path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z" fill="currentColor"/></svg>
              {{ completedCount }}
            </div>
            <small class="text-muted">Workouts</small>
          </div>
          <div class="col-4 stat-col">
            <div class="h5 light-blue-text">
              <svg class="stat-icon" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z" fill="currentColor"/></svg>
              8
            </div>
            <small class="text-muted">Weeks</small>
          </div>
          <div class="col-4 stat-col">
            <div class="h5 light-blue-text">
              <svg class="stat-icon" viewBox="0 0 24 24"><path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" fill="currentColor"/></svg>
              {{ consistency }}%
            </div>
            <small class="text-muted">Consistency</small>
          </div>
        </div>
      </div>

      <!-- Кнопка выхода -->
      <button v-if="isAuthenticated" class="btn btn-outline-danger btn-sm mt-3" @click="$emit('logout')">
        Logout
      </button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'UserInfo',
  props: {
    user: { type: Object, default: null },
    isAuthenticated: { type: Boolean, default: false },
    completedCount: { type: Number, default: 0 }
  },
  emits: ['logout'],
  setup(props) {
    const displayName = computed(() => 
      props.user ? `${props.user.firstName} ${props.user.lastName}` : 'Atanova Sophie'
    )
    const consistency = computed(() => 
      Math.min(100, Math.round((props.completedCount / 10) * 100))
    )
    return { displayName, consistency }
  }
}
</script>

<style scoped>
.user-avatar .avatar-placeholder {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--theme-primary, #4f86f7), var(--theme-accent, #38b2ac));
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.avatar-icon {
  width: 60px;
  height: 60px;
}

.avatar-path {
  fill: white;
}

.user-stats .stat-col {
  border-right: 1px solid var(--theme-border, #e2e8f0);
  padding: 5px;
}

.user-stats .stat-col:last-child {
  border-right: none;
}

.stat-icon {
  width: 16px;
  height: 16px;
  margin-right: 4px;
  vertical-align: -2px;
}

.user-stats .h5 {
  font-size: 1rem;
  white-space: nowrap;
  margin-bottom: 0.25rem;
}

.user-stats small {
  font-size: 0.7rem;
}
</style>
