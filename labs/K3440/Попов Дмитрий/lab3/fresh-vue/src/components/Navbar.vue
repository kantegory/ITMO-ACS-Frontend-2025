<template>
  <aside class="sidebar p-3">
    <div class="text-center mb-3">
      <div class="h4 fw-bold">FRESH</div>
      <div class="small text-white-50">Fitness & Health</div>
    </div>
    <nav class="nav flex-column">
      <RouterLink class="nav-link" to="/">Главная</RouterLink>
      <RouterLink class="nav-link" to="/search">Поиск</RouterLink>
      <RouterLink class="nav-link" to="/blog">Блог</RouterLink>
      <RouterLink v-if="user" class="nav-link" to="/dashboard">Кабинет</RouterLink>
      <RouterLink v-if="!user" class="nav-link" to="/login">Вход</RouterLink>
      <RouterLink v-if="!user" class="btn btn-primary mt-3" to="/register">Регистрация</RouterLink>
      <button v-if="user" class="btn btn-outline-light mt-3" @click="logout">Выход</button>
    </nav>
  </aside>
</template>


<script setup>
import { useAuth } from '../common/useAuth'
import { computed } from 'vue'
const { user, logout } = useAuth()
const userVal = computed(() => user.value)
</script>


<style scoped>
.sidebar{width:260px;background:#111827;color:#fff;min-height:100vh}
.nav-link{color:#fff}
</style>