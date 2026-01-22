<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { Sun, Moon, User, LogOut } from 'lucide-vue-next'
import { currentUser, logout } from '../composables/useAuth'

const props = defineProps({
  theme: String,
  toggleTheme: Function
})

const router = useRouter()

function handleLogout() {
  logout()
  router.push('/login')
}
</script>

<template>
  <nav class="navbar themed-navbar p-3">
    <div class="container">
      <RouterLink class="navbar-brand" to="/">RestaurantBooking</RouterLink>

      <button class="btn btn-secondary me-2" @click="toggleTheme">
        <component :is="props.theme === 'dark' ? Sun : Moon" width="20" height="20" />
      </button>

      <div class="d-flex gap-2">
        <template v-if="currentUser">
          <RouterLink to="/account" class="btn btn-outline-primary">
            <User width="16" height="16" /> Личный кабинет
          </RouterLink>
          <button class="btn btn-outline-danger" @click="handleLogout">
            <LogOut width="16" height="16" /> Выйти
          </button>
        </template>

        <template v-else>
          <RouterLink class="btn btn-primary" to="/login">Вход</RouterLink>
          <RouterLink class="btn btn-primary" to="/register">Регистрация</RouterLink>
        </template>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.themed-navbar {
  background-color: var(--navbar-bg);
  color: var(--navbar-text);
  transition: background-color 0.3s, color 0.3s;
}

.navbar a,
.navbar span,
.navbar button {
  color: var(--navbar-text);
}
</style>

