<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../api'

const name = ref('')
const email = ref('')
const password = ref('')
const router = useRouter()

async function register() {
  try {
    const res = await api.loginUser(email.value, '') // Проверка на существование
    if (res.data.length > 0) {
      alert('Пользователь с таким email уже зарегистрирован')
      return
    }
    await api.registerUser({ name: name.value, email: email.value, password: password.value })
    alert('Регистрация прошла успешно')
    router.push('/login')
  } catch (err) {
    console.error(err)
    alert('Ошибка при регистрации')
  }
}
</script>

<template>
  <div class="container mt-5">
    <h2>Регистрация</h2>
    <form @submit.prevent="register" class="mt-3">
      <div class="mb-3">
        <label>Имя</label>
        <input type="text" v-model="name" class="form-control" required>
      </div>
      <div class="mb-3">
        <label>Email</label>
        <input type="email" v-model="email" class="form-control" required>
      </div>
      <div class="mb-3">
        <label>Пароль</label>
        <input type="password" v-model="password" class="form-control" required>
      </div>
      <button type="submit" class="btn btn-primary">Создать аккаунт</button>
    </form>
  </div>
</template>
