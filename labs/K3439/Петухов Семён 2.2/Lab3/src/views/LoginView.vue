<template>
  <main class="container auth-wrapper d-flex align-items-center justify-content-center" role="main">
    <div class="card card-custom p-4 auth-card auth-card-narrow">
      <h1 class="h4 mb-3">Вход</h1>
      <form @submit.prevent="handleSubmit" novalidate>
        <div class="mb-3">
          <label class="form-label" for="loginEmail">Эл. почта</label>
          <input 
            id="loginEmail" 
            v-model="email"
            name="email" 
            type="email" 
            class="form-control" 
            required 
            autocomplete="email"
          >
        </div>
        <div class="mb-3">
          <label class="form-label" for="loginPassword">Пароль</label>
          <input 
            id="loginPassword" 
            v-model="password"
            name="password" 
            type="password" 
            class="form-control" 
            required 
            autocomplete="current-password"
          >
        </div>
        <div class="d-flex justify-content-between align-items-center mb-3">
          <RouterLink to="/register">Создать аккаунт</RouterLink>
          <button class="btn btn-primary" type="submit">Войти</button>
        </div>
      </form>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useDataService } from '@/composables/useDataService'
import { useNotifications } from '@/composables/useNotifications'

const router = useRouter()
const { setCurrentUser } = useAuth()
const { queryUserByCredentials } = useDataService()
const { showModal } = useNotifications()

const email = ref('')
const password = ref('')

async function handleSubmit() {
  const emailVal = email.value.trim()
  const pwdVal = password.value.trim()
  
  if (!emailVal || !pwdVal) {
    await showModal({
      title: 'Сообщение',
      message: 'Пожалуйста, заполните все поля',
      type: 'danger'
    })
    return
  }
  
  const found = await queryUserByCredentials(emailVal, pwdVal)
  if (found) {
    setCurrentUser(found)
    router.push('/dashboard')
  } else {
    await showModal({
      title: 'Сообщение',
      message: 'Неверные данные или сервер недоступен.',
      type: 'danger'
    })
  }
}
</script>

