<template>
  <div class="card glass-card mb-4">
    <div class="card-body text-center">
      <div class="mb-3">
        <div class="rounded-circle bg-primary d-inline-flex align-items-center justify-content-center" style="width: 80px; height: 80px;">
          <span style="font-size: 2rem;">👤</span>
        </div>
      </div>
      <h2 class="light-blue-text">{{ displayName }}</h2>
      <p class="text-muted">{{ isAuthenticated ? 'Fitness Enthusiast' : 'Guest User' }}</p>
      <div class="row text-center mt-3">
        <div class="col-4 border-end">
          <div class="h5 light-blue-text">{{ completedCount }}</div>
          <small class="text-muted">Workouts</small>
        </div>
        <div class="col-4 border-end">
          <div class="h5 light-blue-text">8</div>
          <small class="text-muted">Weeks</small>
        </div>
        <div class="col-4">
          <div class="h5 light-blue-text">{{ consistency }}%</div>
          <small class="text-muted">Consistency</small>
        </div>
      </div>
      <button v-if="isAuthenticated" class="btn btn-outline-danger btn-sm mt-3" @click="$emit('logout')">Logout</button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
export default {
  name: 'UserInfo',
  props: { user: Object, isAuthenticated: Boolean, completedCount: { type: Number, default: 0 } },
  emits: ['logout'],
  setup(props) {
    const displayName = computed(() => props.user ? `${props.user.firstName} ${props.user.lastName}` : 'Guest User')
    const consistency = computed(() => Math.min(100, Math.round((props.completedCount / 10) * 100)))
    return { displayName, consistency }
  }
}
</script>
