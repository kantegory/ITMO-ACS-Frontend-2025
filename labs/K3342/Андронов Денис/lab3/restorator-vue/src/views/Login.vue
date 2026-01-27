<template>
  <div style="max-width: 400px; margin: 0 auto;">
    <h2 class="mb-4">Вход</h2>

    <form @submit.prevent="handleLogin">
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input v-model="email" type="email" class="form-control" required>
      </div>

      <div class="mb-3">
        <label class="form-label">Пароль</label>
        <input v-model="password" type="password" class="form-control" required>
      </div>

      <button type="submit" class="btn btn-primary w-100">Войти</button>
    </form>

    <div v-if="error" class="text-danger mt-3">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '@/composables/useApi'
import { useAuth } from '@/composables/useAuth'

const { loginUser } = useApi()
const router = useRouter()
const { user } = useAuth()

const email    = ref('')
const password = ref('')
const error    = ref('')

async function handleLogin() {
  try {
    const loggedUser = await loginUser(email.value, password.value)
    if (!loggedUser) {
      error.value = 'Неверный email или пароль'
      return
    }

    localStorage.setItem('restorator_user', JSON.stringify(loggedUser))
    user.value = loggedUser
    router.push('/profile')
  } catch (err) {
    error.value = 'Ошибка сервера'
  }
}
</script>