<template>
  <div style="max-width: 400px; margin: 0 auto;">
    <h2 class="mb-4">Регистрация</h2>

    <form @submit.prevent="handleRegister">
      <div class="mb-3">
        <label class="form-label">Имя</label>
        <input v-model="name" type="text" class="form-control" required>
      </div>

      <div class="mb-3">
        <label class="form-label">Email</label>
        <input v-model="email" type="email" class="form-control" required>
      </div>

      <div class="mb-3">
        <label class="form-label">Пароль</label>
        <input v-model="password" type="password" class="form-control" required>
      </div>

      <button class="btn btn-success w-100">Зарегистрироваться</button>
    </form>

    <div v-if="error" class="text-danger mt-3">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '@/composables/useApi'

const { registerUser } = useApi()
const router = useRouter()

const name     = ref('')
const email    = ref('')
const password = ref('')
const error    = ref('')

async function handleRegister() {
  try {
    await registerUser(name.value, email.value, password.value)
    router.push('/login')
  } catch (err) {
    error.value = err.message === 'User exists'
      ? 'Пользователь с таким email уже существует'
      : 'Ошибка сервера'
  }
}
</script>