<template>
  <div class="login-container d-flex justify-content-center">
    <div class="login-box w-100" style="max-width:420px">
      <h3 class="text-center mb-4">Вход</h3>
      <form @submit.prevent="onSubmit">
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input v-model="form.email" type="email" class="form-control" required />
        </div>
        <div class="mb-3">
          <label class="form-label">Пароль</label>
          <input v-model="form.password" type="password" class="form-control" required />
        </div>
        <button class="btn btn-primary w-100" type="submit">Войти</button>
      </form>
      <div class="register-text text-center mt-3">
        <p>Нет аккаунта? <router-link to="/register">Зарегистрироваться</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const form = reactive({ email: '', password: '' })
const router = useRouter()

async function onSubmit() {
  try {
    const response = await axios({
      method: 'post',
      url: `${import.meta.env.VITE_API_URL}/login`,
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({
        email: form.email,
        password: form.password
      })
    })

    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    
    router.push({ name: 'Search' })
  } catch (e) {
    alert('Ошибка регистрации: ' + e.response.data)
  }
}
</script>
