<template>
  <header class="bg-dark text-white p-3 d-flex justify-content-between align-items-center">
    <h1>
      <router-link to="/" class="text-white text-decoration-none">Restaurant Booking</router-link>
    </h1>
    <div>
      <template v-if="!isAuthenticated">
        <button class="btn btn-outline-light me-2" @click="$emit('show-login')">Вход</button>
        <button class="btn btn-outline-light" @click="$emit('show-register')">Регистрация</button>
      </template>
      <template v-else>
        <router-link to="/profile" class="btn btn-outline-light me-2">Личный кабинет</router-link>
        <button class="btn btn-outline-light" @click="handleLogout">Выход</button>
      </template>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const { isAuthenticated, logout } = useAuth()
const router = useRouter()

defineEmits(['show-login', 'show-register'])

const handleLogout = () => {
  logout()
  router.push('/')
}
</script>

