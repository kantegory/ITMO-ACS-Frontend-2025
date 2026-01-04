<template>
  <main class="container auth-wrapper d-flex align-items-center justify-content-center" role="main">
    <div class="card card-custom p-4 auth-card auth-card-wide">
      <h1 class="h4 mb-3">Создать аккаунт</h1>
      <form @submit.prevent="handleSubmit" novalidate>
        <div class="mb-2">
          <label class="form-label" for="registerName">Полное имя</label>
          <input 
            id="registerName" 
            v-model="name"
            name="name" 
            type="text" 
            class="form-control" 
            required 
            autocomplete="name"
          >
        </div>
        <div class="mb-2">
          <label class="form-label" for="registerEmail">Эл. почта</label>
          <input 
            id="registerEmail" 
            v-model="email"
            name="email" 
            type="email" 
            class="form-control" 
            required 
            autocomplete="email"
          >
        </div>
        <div class="mb-2">
          <label class="form-label" for="registerPassword">Пароль</label>
          <input 
            id="registerPassword" 
            v-model="password"
            name="password" 
            type="password" 
            class="form-control" 
            required 
            autocomplete="new-password"
          >
        </div>
        <div class="mb-3">
          <label class="form-label" for="registerConfirm">Подтвердите пароль</label>
          <input 
            id="registerConfirm" 
            v-model="confirm"
            name="confirm" 
            type="password" 
            class="form-control" 
            required 
            autocomplete="new-password"
          >
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <RouterLink to="/login">Уже есть аккаунт?</RouterLink>
          <button class="btn btn-primary" type="submit">Зарегистрироваться</button>
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
const { findUserByEmail, createUser } = useDataService()
const { showModal } = useNotifications()

const name = ref('')
const email = ref('')
const password = ref('')
const confirm = ref('')

async function handleSubmit() {
  const nameVal = name.value.trim()
  const emailVal = email.value.trim()
  const p1 = password.value.trim()
  const p2 = confirm.value.trim()
  
  if (!nameVal || !emailVal || !p1 || !p2) {
    await showModal({
      title: 'Сообщение',
      message: 'Пожалуйста, заполните все поля',
      type: 'danger'
    })
    return
  }
  
  if (p1 !== p2) {
    await showModal({
      title: 'Сообщение',
      message: 'Пароли не совпадают',
      type: 'danger'
    })
    return
  }
  
  const existing = await findUserByEmail(emailVal)
  if (existing) {
    await showModal({
      title: 'Сообщение',
      message: 'Пользователь с такой эл. почтой уже существует',
      type: 'danger'
    })
    return
  }
  
  const username = emailVal.split('@')[0]
  const payload = { name: nameVal, email: emailVal, password: p1, username }
  const created = await createUser(payload)
  if (!created) {
    return
  }
  
  setCurrentUser(created)
  router.push('/dashboard')
}
</script>

