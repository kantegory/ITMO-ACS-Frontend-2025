<template>
  <base-layout>
    <section class="login-card" aria-labelledby="auth-title">
      <h1 id="auth-title" class="text-center mb-4">Регистрация</h1>
      <form @submit.prevent="submit">
        <div class="mb-3">
          <label class="form-label" for="name">Имя</label>
          <input type="text" class="form-control" v-model="form.name" required />
        </div>

        <div class="mb-3">
          <label class="form-label" for="email">Email</label>
          <input type="email" class="form-control" v-model="form.email" required />
        </div>

        <div class="mb-3">
          <label class="form-label" for="password">Пароль</label>
          <input type="password" class="form-control" v-model="form.password" required />
        </div>

        <div class="mb-3">
          <label class="form-label" for="password-repeat">Повторите пароль</label>
          <input type="password" class="form-control" v-model="form.password_repeat" required />
        </div>

        <div v-if="error" class="text-danger mb-3" role="alert" aria-live="assertive">
          {{ error }}
        </div>

        <div v-if="success" class="text-success mb-3" role="status" aria-live="polite">
          Регистрация успешна! Перенаправление…
        </div>

        <button class="btn btn-primary w-100">Зарегистрироваться</button>
      </form>

      <nav class="text-center mt-3" aria-label="Навигация входа">
        Уже зарегистрированы? <router-link to="/login">Войти</router-link>
      </nav>
    </section>
  </base-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseLayout from '@/layouts/BaseLayout.vue'
import useAuthStore from '@/stores/auth.js'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  name: '',
  email: '',
  password: '',
  password_repeat: ''
})

const success = ref(false)
const error = computed(() => authStore.error)

const submit = async () => {
  if (form.value.password !== form.value.password_repeat) {
    authStore.error = 'Пароли не совпадают'
    return
  }

  success.value = await authStore.register(form.value)

  if (success.value) {
    setTimeout(() => {
      router.push('/login')
    }, 800)
  }
}

onMounted(() => {
  authStore.clearError()
})
</script>
