<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-3">
      <label for="fullName" class="form-label">Полное имя</label>
      <input 
        type="text" 
        class="form-control" 
        id="fullName" 
        v-model="fullName"
        required 
        aria-required="true" 
        autocomplete="name"
      >
    </div>
    <div class="mb-3">
      <label for="email" class="form-label">Email</label>
      <input 
        type="email" 
        class="form-control" 
        id="email" 
        v-model="email"
        required 
        aria-required="true" 
        autocomplete="email"
      >
    </div>
    <div class="mb-3">
      <label for="phone" class="form-label">Телефон</label>
      <input 
        type="tel" 
        class="form-control" 
        id="phone" 
        v-model="phone"
        required 
        aria-required="true" 
        autocomplete="tel"
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
        autocomplete="new-password"
      >
      <small class="form-text text-muted">Минимум 8 символов</small>
    </div>
    <div class="mb-3">
      <label for="confirmPassword" class="form-label">Подтвердите пароль</label>
      <input 
        type="password" 
        class="form-control" 
        id="confirmPassword" 
        v-model="confirmPassword"
        required 
        aria-required="true" 
        autocomplete="new-password"
      >
    </div>
    <div v-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>
    <button type="submit" class="btn btn-primary w-100 mb-3" :disabled="loading">
      {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
    </button>
    <div class="text-center">
      <p class="mb-0">Уже есть аккаунт? <router-link to="/login">Войти</router-link></p>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { validateEmail, validatePasswordLength, validatePasswordMatch } from '@/utils/validators'

const router = useRouter()
const { register } = useAuth()

const fullName = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  error.value = ''

  // Валидация
  if (!validateEmail(email.value)) {
    error.value = 'Введите корректный email адрес'
    return
  }

  if (!validatePasswordLength(password.value)) {
    error.value = 'Пароль должен содержать минимум 8 символов'
    return
  }

  if (!validatePasswordMatch(password.value, confirmPassword.value)) {
    error.value = 'Пароли не совпадают'
    return
  }

  loading.value = true

  try {
    await register({
      fullName: fullName.value,
      email: email.value,
      phone: phone.value,
      password: password.value
    })
    router.push('/profile')
  } catch (err) {
    error.value = err.response?.data?.error || 'Ошибка при регистрации'
  } finally {
    loading.value = false
  }
}
</script>
