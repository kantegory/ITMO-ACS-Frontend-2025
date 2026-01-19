<template>
  <div class="login-container d-flex justify-content-center">
    <div class="login-box w-100" style="max-width:480px">
      <h3 class="text-center mb-4">Регистрация</h3>
      <form @submit.prevent="onSubmit">
        <div class="mb-3">
          <label class="form-label">Имя</label>
          <input v-model="form.name" type="text" class="form-control" required />
        </div>
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input v-model="form.email" type="email" class="form-control" required />
        </div>
        <div class="mb-3">
          <label class="form-label">Пароль</label>
          <input v-model="form.password" type="password" class="form-control" required />
        </div>
        <div class="mb-3">
          <label class="form-label">Повтор пароля</label>
          <input v-model="form.confirmPassword" type="password" class="form-control" required />
        </div>
        <div class="mb-3">
          <label class="form-label d-block">Выберите роль:</label>
          <div class="form-check form-check-inline">
            <input v-model="form.role" class="form-check-input" type="radio" id="jobSeeker" value="1" />
            <label class="form-check-label" for="jobSeeker">Я ищу работу</label>
          </div>
          <div class="form-check form-check-inline">
            <input v-model="form.role" class="form-check-input" type="radio" id="employer" value="2" />
            <label class="form-check-label" for="employer">Я работодатель</label>
          </div>
        </div>
        <button class="btn btn-primary w-100" type="submit">Зарегистрироваться</button>
      </form>
      <div class="register-text text-center mt-3">
        <p>Уже есть аккаунт? <router-link to="/login">Войти</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: '1'
})

const router = useRouter()

async function onSubmit() {
  if (form.password !== form.confirmPassword) {
    alert('Пароли не совпадают')
    return
  }

  try {
    const response = await axios({
      method: 'post',
      url: `${import.meta.env.VITE_API_URL}/register`,
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({
        email: form.email,
        password: form.password,
        name: form.name,
        role: form.role
      })
    })

    localStorage.setItem('token', response.data.accessToken)
    localStorage.setItem('user', JSON.stringify(response.data.user))

    router.push({ name: 'Search' })
  } catch (e) {
    alert('Ошибка регистрации: ' + e.response.data)
  }
}
</script>