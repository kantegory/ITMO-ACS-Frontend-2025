<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../api'
import { login } from '../composables/useAuth'

const email = ref('')
const password = ref('')
const router = useRouter()

async function submitLogin() {
  try {
    const res = await api.loginUser(email.value, password.value)
    const user = res.data[0]

    if (!user) {
      alert('Неверный email или пароль')
      return
    }

    // Логиним через composable
    login(user)

    // Редирект на страницу с ресторанами или аккаунт
    router.push('/account')
  } catch (err) {
    console.error(err)
    alert('Ошибка при входе')
  }
}
</script>

<template>
  <div class="container mt-5">
    <h2>Вход</h2>
    <form @submit.prevent="submitLogin" class="mt-3">
      <div class="mb-3">
        <label>Email</label>
        <input type="email" v-model="email" class="form-control" required>
      </div>
      <div class="mb-3">
        <label>Пароль</label>
        <input type="password" v-model="password" class="form-control" required>
      </div>
      <button type="submit" class="btn btn-primary">Войти</button>
    </form>
  </div>
</template>

