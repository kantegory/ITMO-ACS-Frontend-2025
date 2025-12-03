<template>
  <div class="auth-container">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="card shadow-lg">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <UshankaSvg :width="48" :height="48" class="mb-3" />
                <h2>Join RentAparts</h2>
                <p class="text-muted">Create your account to start exploring</p>
              </div>

              <form @submit.prevent="handleRegister">
                <div class="row">
                  <div class="col-6">
                    <div class="mb-3">
                      <label for="firstName" class="form-label">First Name</label>
                      <input
                        v-model="form.firstName"
                        type="text"
                        class="form-control"
                        id="firstName"
                        required
                      >
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="mb-3">
                      <label for="lastName" class="form-label">Last Name</label>
                      <input
                        v-model="form.lastName"
                        type="text"
                        class="form-control"
                        id="lastName"
                        required
                      >
                    </div>
                  </div>
                </div>

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
                  {{ authStore.isLoading ? 'Creating Account...' : 'Create Account' }}
                </button>

                <div class="text-center">
                  <p class="mb-0">
                    Already have an account?
                    <RouterLink to="/login" class="text-decoration-none">Sign in here</RouterLink>
                  </p>
                </div>
              </form>
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
  firstName: '',
  lastName: '',
  email: '',
  password: ''
})

onMounted(() => {
  authStore.clearError()
})

const handleRegister = async () => {
  const result = await authStore.register(form.value)

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
  color: #333;
  font-weight: 700;
}
</style>