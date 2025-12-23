<template>
  <nav
    class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top"
    role="navigation"
    aria-label="Основная навигация"
  >
    <div class="container">
      <RouterLink
        to="/"
        class="navbar-brand d-flex align-items-center"
        aria-label="SharCook - Главная страница"
      >
        <svg class="icon icon-logo" aria-hidden="true" width="32" height="32">
          <use href="/src/assets/images/icons-sprite.svg#icon-egg-fried"></use>
        </svg>
        <span class="fw-bold">SharCook</span>
      </RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Переключить навигацию"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto me-3">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link" active-class="active">Главная</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/search" class="nav-link" active-class="active">Поиск</RouterLink>
          </li>
          <li class="nav-item" v-if="authStore.isLoggedIn">
            <RouterLink to="/profile" class="nav-link" active-class="active">Профиль</RouterLink>
          </li>
        </ul>

        <div class="d-flex gap-2 align-items-center">
          <button
            @click="themeStore.toggleTheme"
            class="btn btn-theme-toggle"
            aria-label="Переключить цветовую тему"
            title="Сменить цветовую тему"
          >
            <svg class="icon" aria-hidden="true" width="20" height="20">
              <use href="/src/assets/images/icons-sprite.svg#icon-palette"></use>
            </svg>
          </button>

          <div v-if="!authStore.isLoggedIn" class="d-flex gap-2">
            <RouterLink to="/login" class="btn btn-outline-secondary">Войти</RouterLink>
          </div>

          <div v-else class="dropdown">
            <button
              class="btn btn-primary dropdown-toggle d-flex align-items-center gap-2"
              type="button"
              id="userDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <div class="avatar-small">
                {{ authStore.currentUser?.username?.charAt(0).toUpperCase() || '?' }}
              </div>
              {{ authStore.currentUser?.username }}
            </button>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
              <li>
                <RouterLink to="/profile" class="dropdown-item">
                  <svg class="icon me-2" aria-hidden="true" width="16" height="16">
                    <use href="/src/assets/images/icons-sprite.svg#icon-person"></use>
                  </svg>
                  Мой профиль
                </RouterLink>
              </li>
              <li>
                <hr class="dropdown-divider"/>
              </li>
              <li>
                <button @click="handleLogout" class="dropdown-item text-danger">
                  <svg class="icon me-2" aria-hidden="true" width="16" height="16">
                    <use href="/src/assets/images/icons-sprite.svg#icon-box-arrow-right"></use>
                  </svg>
                  Выход
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import {RouterLink, useRouter} from 'vue-router'
import {useAuthStore} from '@/stores/auth'
import {useThemeStore} from '@/stores/theme'
import {useToast} from '@/composables/useToast'

const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const {showToast} = useToast()

const handleLogout = () => {
  authStore.logout()
  router.push('/')
  showToast('Вы вышли из аккаунта', 'info')
}
</script>

<style scoped>
.avatar-small {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.dropdown-item {
  display: flex;
  align-items: center;
}

.icon {
  flex-shrink: 0;
}
</style>
