<template>
  <header class="bg-light">
    <nav class="navbar navbar-expand-lg w-100 px-3">
      <router-link class="navbar-brand" to="/">
        <svg class="icon icon-home" aria-hidden="true"><use href="#icon-home"></use></svg>
        RentalSite
      </router-link>
      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navMain"
        aria-controls="navMain"
        aria-expanded="false"
        aria-label="Переключить навигацию"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navMain">
        <ul class="navbar-nav ms-auto">
          <li v-if="!isAuthenticated" class="nav-item">
            <router-link class="nav-link" to="/login">
              <svg class="icon" aria-hidden="true"><use href="#icon-login"></use></svg>
              Вход
            </router-link>
          </li>
          <li v-if="!isAuthenticated" class="nav-item">
            <router-link class="btn btn-primary ms-2" to="/register">
              <svg class="icon" aria-hidden="true"><use href="#icon-register"></use></svg>
              Регистрация
            </router-link>
          </li>
          <li v-if="isAuthenticated" class="nav-item">
            <router-link class="nav-link" to="/profile">
              <svg class="icon" aria-hidden="true"><use href="#icon-user"></use></svg>
              Профиль
            </router-link>
          </li>
          <li v-if="isAuthenticated" class="nav-item">
            <a class="nav-link text-danger" href="#" @click.prevent="handleLogout">
              <svg class="icon" aria-hidden="true"><use href="#icon-logout"></use></svg>
              Выход
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { isAuthenticated, logout } = useAuth()

const handleLogout = async () => {
  await logout()
}
</script>

<style scoped>
.navbar {
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.navbar-brand {
  font-weight: bold;
  color: #452cb3;
  text-decoration: none;
}

.icon {
  width: 1em;
  height: 1em;
  display: inline-block;
  vertical-align: middle;
  margin-right: 0.25em;
}
</style>

