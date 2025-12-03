<template>
  <div class="profile-page">
    <div class="container py-4" style="margin-top: 80px;">
      <div class="row">
        <div class="col-md-8 mx-auto">
          <div class="card">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <div class="avatar-placeholder">
                  <i class="fas fa-user fa-3x text-muted"></i>
                </div>
                <h2 class="mt-3">{{ user?.firstName }} {{ user?.lastName }}</h2>
                <p class="text-muted">{{ user?.email }}</p>
              </div>

              <div class="profile-section">
                <h4>Account Information</h4>
                <div class="row">
                  <div class="col-sm-6">
                    <div class="mb-3">
                      <label class="form-label">First Name</label>
                      <input
                        v-model="profileForm.firstName"
                        type="text"
                        class="form-control"
                        readonly
                      >
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <div class="mb-3">
                      <label class="form-label">Last Name</label>
                      <input
                        v-model="profileForm.lastName"
                        type="text"
                        class="form-control"
                        readonly
                      >
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input
                    v-model="profileForm.email"
                    type="email"
                    class="form-control"
                    readonly
                  >
                </div>
              </div>

              <div class="profile-section">
                <h4>Quick Actions</h4>
                <div class="d-grid gap-2">
                  <RouterLink to="/search" class="btn btn-primary">
                    <i class="fas fa-search me-2"></i>Search Properties
                  </RouterLink>
                  <RouterLink to="/messages" class="btn btn-outline-primary">
                    <i class="fas fa-envelope me-2"></i>View Messages
                  </RouterLink>
                  <button @click="handleLogout" class="btn btn-outline-danger">
                    <i class="fas fa-sign-out-alt me-2"></i>Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)

const profileForm = ref({
  firstName: '',
  lastName: '',
  email: ''
})

onMounted(() => {
  if (user.value) {
    profileForm.value = {
      firstName: user.value.firstName,
      lastName: user.value.lastName,
      email: user.value.email
    }
  }
})

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.card {
  border: none;
  border-radius: 1rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.075);
}

.avatar-placeholder {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  border: 3px solid #dee2e6;
}

.profile-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #dee2e6;
}

.profile-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.profile-section h4 {
  color: #495057;
  font-weight: 600;
  margin-bottom: 1rem;
}

.form-control[readonly] {
  background-color: #f8f9fa;
  border-color: #dee2e6;
}
</style>