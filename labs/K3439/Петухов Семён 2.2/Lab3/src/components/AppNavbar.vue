<template>
  <header>
    <nav class="navbar navbar-expand-lg py-3 container" aria-label="Основная навигация">
      <RouterLink class="navbar-brand brand" to="/">FastRent</RouterLink>
      <div class="ms-auto d-flex align-items-center gap-3">
        <div class="nav-user d-flex align-items-center gap-2">
          <template v-if="user">
            <span class="me-2 align-self-center">{{ user.name }}</span>
            <RouterLink to="/profile" class="btn btn-sm btn-outline-primary me-2 btn-icon" aria-label="Профиль" title="Профиль">
              <svg class="icon" aria-hidden="true" focusable="false">
                <use href="#icon-profile"></use>
              </svg>
              <span class="visually-hidden">Профиль</span>
            </RouterLink>
            <RouterLink to="/dashboard" class="btn btn-sm btn-outline-primary me-2 align-self-center">Объявления</RouterLink>
            <button @click="handleLogout" class="btn btn-sm btn-danger align-self-center">Выйти</button>
          </template>
          <template v-else>
            <RouterLink to="/login" class="btn btn-sm btn-primary align-self-center">Войти</RouterLink>
          </template>
        </div>
        <ThemeToggle />
      </div>
    </nav>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import ThemeToggle from './ThemeToggle.vue'

const router = useRouter()
const { currentUser, logout: authLogout } = useAuth()

const user = computed(() => currentUser.value)

function handleLogout() {
  authLogout()
  router.push('/')
}
</script>

