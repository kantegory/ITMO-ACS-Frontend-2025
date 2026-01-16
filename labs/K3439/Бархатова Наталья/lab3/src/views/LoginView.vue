<template>
  <base-layout>
    <section class="login-card" aria-labelledby="login-title">
      <h1 id="login-title" class="text-center mb-4">Вход в аккаунт</h1>
      <form @submit.prevent="submit">
        <div class="mb-3">
          <label class="form-label" for="email">Email</label>
          <input type="email" class="form-control" v-model="form.email" required>
        </div>
        <div class="mb-3">
          <label class="form-label" for="password">Пароль</label>
          <input type="password" class="form-control" v-model="form.password" required>
        </div>
        <div v-if="error" class="text-danger mt-3" role="alert" aria-live="assertive">
          {{ error }}
        </div>
        <button class="btn btn-primary w-100">Войти</button>
      </form>
      <nav class="text-center mt-3" aria-label="Навигация восстановления и регистрации">
        <router-link to="/register">Создать аккаунт</router-link>
        <router-link to="/password-recovery" class="ms-3">Забыли пароль?</router-link>
      </nav>
    </section>
  </base-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import useAuthStore from '@/stores/auth'
import BaseLayout from '@/layouts/BaseLayout.vue'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: ''
})

const error = computed(() => authStore.error)

const submit = async () => {
  const success = await authStore.login(form.value.email, form.value.password)
  if (success) {
    router.push('/restaurants')
  }
}

onMounted(() => {
  authStore.clearError()
})
</script>
