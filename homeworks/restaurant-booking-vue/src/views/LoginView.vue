<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../api'

const email = ref('')
const password = ref('')
const router = useRouter()

async function login() {
  try {
    const res = await api.loginUser(email.value, password.value)
    if (res.data.length === 0) {
      alert('Неверный email или пароль')
      return
    }
    const user = res.data[0]
    localStorage.setItem('currentUser', JSON.stringify(user))
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
    <form @submit.prevent="login" class="mt-3">
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
