<template>
  <div class="container my-4">
    <h2>Личный кабинет</h2>
    <p v-if="currentUser">Добро пожаловать, {{ currentUser.name }}!</p>

    <div class="d-flex gap-2 mt-3">
      <RouterLink to="/history" class="btn btn-primary">История бронирований</RouterLink>
      <button class="btn btn-outline-danger" @click="handleLogout">Выйти</button>
    </div>
  </div>
</template>

<script setup>
import { currentUser, logout } from '../composables/useAuth'
import { useRouter, RouterLink } from 'vue-router'

const router = useRouter()

// Редирект на логин, если не залогинен
if (!currentUser.value) {
  router.push('/login')
}

function handleLogout() {
  logout()
  router.push('/login')
}
</script>

<style scoped>
h2 {
  margin-bottom: 1rem;
}
</style>
