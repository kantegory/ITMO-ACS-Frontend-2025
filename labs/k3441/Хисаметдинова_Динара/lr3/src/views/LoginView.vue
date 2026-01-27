<template>
  <div class="auth-container">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="card shadow-lg">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <UshankaSvg :width="48" :height="48" class="mb-3" />
                <h2>Welcome Back</h2>
                <p class="text-muted">Sign in to your RentAparts account</p>
              </div>

              <form @submit.prevent="handleLogin">
                <div class="mb-3">
                  <label for="email" class="form-label">Email address</label>
                  <input
                    v-model="form.email"
                    type="email"
                    class="form-control"
                    id="email"
                    required
                  >
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input
                    v-model="form.password"
                    type="password"
                    class="form-control"
                    id="password"
                    required
                  >
                </div>

                <div v-if="authStore.error" class="alert alert-danger" role="alert">
                  {{ authStore.error }}
                </div>

                <button
                  type="submit"
                  class="btn btn-primary w-100 mb-3"
                  :disabled="authStore.isLoading"
                >
                  <span v-if="authStore.isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {{ authStore.isLoading ? 'Signing in...' : 'Sign In' }}
                </button>

                <div class="text-center">
                  <p class="mb-0">
                    Don't have an account?
                    <RouterLink to="/register" class="text-decoration-none">Sign up here</RouterLink>
                  </p>
                </div>
              </form>

              <hr class="my-4">

              <div class="text-center">
                <small class="text-muted">
                  Demo credentials:<br>
                  Email: test@example.com<br>
                  Password: password123
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import UshankaSvg from '@/components/icons/UshankaSvg.vue'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: ''
})

onMounted(() => {
  authStore.initializeAuth()
  authStore.clearError()

  if (authStore.isAuthenticated) {
    router.push('/')
  }
})

const handleLogin = async () => {
  const result = await authStore.login(form.value.email, form.value.password)

  if (result.success) {
    router.push('/')
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
}

.card {
  border: none;
  border-radius: 1rem;
}

.form-control {
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
}

.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn-primary {
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-weight: 600;
}

h2 {
  color: var(--text-color);
  font-weight: 700;
}

[data-theme="dark"] h2 {
  color: #ffffff !important;
}

.form-label {
  color: var(--text-color) !important;
}

[data-theme="dark"] .form-label {
  color: #e9ecef !important;
}

.card {
  background-color: var(--card-bg) !important;
  border-color: var(--border-color) !important;
}

[data-theme="dark"] .auth-container {
  background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
}

[data-theme="dark"] .card-body p {
  color: #ced4da !important;
}

[data-theme="dark"] .text-center p {
  color: var(--text-color) !important;
}

[data-theme="dark"] .text-muted {
  color: #adb5bd !important;
}
</style>