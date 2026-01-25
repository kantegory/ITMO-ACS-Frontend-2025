<template>
  <base-layout>
    <section class="login-card" aria-labelledby="reset-title">
      <h1 id="reset-title" class="text-center mb-4">Восстановление пароля</h1>

      <form @submit.prevent="submit">
        <div class="mb-3">
          Подтвердите свою личность и придумайте новый пароль
        </div>

        <div v-if="!userId" class="mb-3">
          <label class="form-label">Email</label>
          <input type="email" class="form-control" v-model="form.email" required />
        </div>

        <div class="form-check mb-3">
          <input class="form-check-input" type="checkbox" v-model="confirmed" required>
          <label class="form-check-label">
            Подтверждаю, что являюсь владельцем аккаунта
          </label>
        </div>

        <div class="mb-3">
          <label class="form-label">Новый пароль</label>
          <input type="password" class="form-control" v-model="form.password" required />
        </div>

        <div class="mb-3">
          <label class="form-label">Повторите пароль</label>
          <input type="password" class="form-control" v-model="form.password_repeat" required />
        </div>

        <div id="form-status">
          <div v-if="error" class="text-danger mb-3" role="alert" aria-live="assertive">
            {{ error }}
          </div>
          <div v-if="success" class="text-success mb-3" role="status" aria-live="polite">
            Пароль успешно изменён. Перенаправление...
          </div>
        </div>

        <button class="btn btn-primary w-100">Сохранить новый пароль</button>
      </form>

      <nav class="text-center mt-3" aria-label="Навигация входа">
        <router-link to="/login">Вернуться к форме входа</router-link>
      </nav>
    </section>
  </base-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseLayout from '@/layouts/BaseLayout.vue'
import useAuthStore from '@/stores/auth.js'

const router = useRouter()
const auth = useAuthStore()

const userId = localStorage.getItem('userId')
const token = localStorage.getItem('token')

const form = ref({
  email: '',
  password: '',
  password_repeat: ''
})
const confirmed = ref(false)
const error = ref(null)
const success = ref(false)

const submit = async () => {
  error.value = null
  success.value = false
  if (!confirmed.value) {
    alert("Подтвердите, что вы владелец аккаунта")
    return
  }
  if (form.value.password !== form.value.password_repeat) {
    error.value = 'Пароли не совпадают!'
    return
  }
  try {
    let result = false

    if (userId && token) {
      result = await auth.updatePassword(userId, token, form.value.password)
    } else {
      if (!form.value.email) {
        error.value = 'Укажите email'
        return
      }
      result = await auth.resetPasswordByEmail(form.value.email, form.value.password)
    }
    if (result) {
      success.value = true
      setTimeout(() => {
        router.push('/login')
      }, 800)
    } else {
      error.value = auth.error
    }
  } catch (e) {
    error.value = 'Ошибка сервера'
    console.error(e)
  }
}
</script>
