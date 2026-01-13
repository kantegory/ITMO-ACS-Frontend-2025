<template>
  <nav class="navbar navbar-expand-lg navbar-light sticky-top">
    <div class="container">
      <router-link class="navbar-brand fw-bold" to="/">
        <i class="bi bi-shop me-2"></i>
        РестоБронь
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto align-items-center">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Главная</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/restaurants">Рестораны</router-link>
          </li>

          <template v-if="user">
            <li class="nav-item">
              <router-link class="nav-link" to="/profile">
                <i class="bi bi-person-circle me-1"></i>
                {{ user.name }}
              </router-link>
            </li>
            <li class="nav-item">
              <button @click="handleLogout" class="btn btn-outline-danger btn-sm ms-2">
                <i class="bi bi-box-arrow-right me-1"></i>
                Выйти
              </button>
            </li>
          </template>

          <template v-else>
            <li class="nav-item">
              <router-link class="nav-link" to="/login">Войти</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/register" class="btn btn-primary btn-sm ms-2">
                Регистрация
              </router-link>
            </li>
          </template>

          <li class="nav-item ms-3">
            <button @click="toggleTheme" class="theme-toggle">
              <i :class="isDark ? 'bi bi-sun-fill' : 'bi bi-moon-fill'"></i>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { storeToRefs } from 'pinia'

const router = useRouter()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const isDark = ref(false)

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.setAttribute(
    'data-theme',
    isDark.value ? 'dark' : 'light'
  )
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'light'
  isDark.value = savedTheme === 'dark'
  document.documentElement.setAttribute('data-theme', savedTheme)
})
</script>

<style scoped>
.navbar {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.navbar-brand {
  font-size: 1.5rem;
  color: var(--primary-color) !important;
}

.nav-link {
  font-weight: 500;
  transition: color 0.3s;
}

.theme-toggle {
  font-size: 1.2rem;
}
</style>