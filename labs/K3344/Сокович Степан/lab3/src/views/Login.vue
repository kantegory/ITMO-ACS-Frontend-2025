<template>
  <div class="container d-flex align-items-center justify-content-center flex-grow-1">
    <div class="row justify-content-center w-100">
      <div class="col-md-5">
        <div class="card p-4 login-card">
          <h3 class="card-title mb-3">Вход</h3>
          <form @submit.prevent="handleSubmit" novalidate>
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input 
                id="email" 
                v-model="form.email" 
                type="email" 
                class="form-control" 
                :class="{ 'is-invalid': errors.email }"
                required
              >
              <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Пароль</label>
              <input 
                id="password" 
                v-model="form.password" 
                type="password" 
                class="form-control" 
                :class="{ 'is-invalid': errors.password }"
                required
                minlength="6"
              >
              <div v-if="errors.password" class="invalid-feedback">{{ errors.password }}</div>
            </div>
            <div v-if="error" class="alert alert-danger" role="alert">
              {{ error }}
            </div>
            <button type="submit" class="btn btn-primary w-100" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              Войти
            </button>
            <div class="text-center mt-3">
              <router-link to="/register">Регистрация</router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login } = useAuth()

const form = ref({
  email: '',
  password: ''
})

const errors = ref({})
const error = ref(null)
const loading = ref(false)

const handleSubmit = async () => {
  errors.value = {}
  error.value = null

  if (!form.value.email) {
    errors.value.email = 'Введите email'
    return
  }

  if (!form.value.password) {
    errors.value.password = 'Введите пароль'
    return
  }

  if (form.value.password.length < 6) {
    errors.value.password = 'Пароль должен быть не менее 6 символов'
    return
  }

  loading.value = true
  try {
    await login(form.value.email, form.value.password)
    router.push('/profile')
  } catch (err) {
    error.value = err.message || 'Ошибка входа'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-card {
  border-radius: 15px;
  box-shadow: 0 6px 12px rgba(0,0,0,0.1);
}

.min-vh-100 {
  min-height: 100vh;
}
</style>

