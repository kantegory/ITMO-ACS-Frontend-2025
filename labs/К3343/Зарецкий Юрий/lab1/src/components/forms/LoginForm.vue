<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-3">
      <label for="email" class="form-label">Email или имя пользователя</label>
      <input 
        type="text" 
        class="form-control" 
        id="email" 
        v-model="email"
        required 
        aria-required="true" 
        autocomplete="username"
      >
    </div>
    <div class="mb-3">
      <label for="password" class="form-label">Пароль</label>
      <input 
        type="password" 
        class="form-control" 
        id="password" 
        v-model="password"
        required 
        aria-required="true" 
        autocomplete="current-password"
      >
    </div>
    <div v-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>
    <button type="submit" class="btn btn-primary w-100 mb-3" :disabled="loading">
      {{ loading ? 'Вход...' : 'Войти' }}
    </button>
    <div class="text-center">
      <p class="mb-0">Нет аккаунта? <router-link to="/register">Зарегистрироваться</router-link></p>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login } = useAuth()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  error.value = ''
  loading.value = true

  try {
    await login(email.value, password.value)
    router.push('/profile')
  } catch (err) {
    error.value = err.response?.data?.error || 'Неверный email или пароль'
  } finally {
    loading.value = false
  }
}
</script>
