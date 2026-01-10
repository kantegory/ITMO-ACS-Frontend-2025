<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary" role="navigation" aria-label="Основная навигация">
      <div class="container">
        <router-link class="navbar-brand d-flex align-items-center" to="/" aria-label="Главная страница - Аренда недвижимости">
          <Icon name="home" size="md" extra-class="me-2" />
          <span>Аренда недвижимости</span>
        </router-link>
        <button 
          class="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Переключить навигацию"
        >
          <span class="navbar-toggler-icon" aria-hidden="true"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <div class="d-flex align-items-center ms-auto gap-3 flex-wrap flex-lg-nowrap">
            <ul class="navbar-nav mb-2 mb-lg-0">
              <li class="nav-item">
                <router-link 
                  class="nav-link" 
                  :class="{ active: $route.path === '/search' }"
                  to="/search"
                >
                  <Icon name="search" size="sm" extra-class="me-2 icon-inline" />
                  Поиск
                </router-link>
              </li>
              <li v-if="currentPage !== 'login' && currentPage !== 'register'" class="nav-item">
                <router-link 
                  class="nav-link" 
                  :class="{ active: $route.path === '/profile' }"
                  to="/profile"
                >
                  Личный кабинет
                </router-link>
              </li>
              <template v-if="!isAuthenticated && (currentPage === 'login' || currentPage === 'register')">
                <li class="nav-item">
                  <router-link 
                    class="nav-link" 
                    :class="{ active: $route.path === '/login' }"
                    to="/login"
                  >
                    <Icon name="user" size="sm" extra-class="me-2 icon-inline" />
                    Вход
                  </router-link>
                </li>
                <li class="nav-item">
                  <router-link 
                    class="nav-link" 
                    :class="{ active: $route.path === '/register' }"
                    to="/register"
                  >
                    <Icon name="building" size="sm" extra-class="me-2 icon-inline" />
                    Регистрация
                  </router-link>
                </li>
              </template>
            </ul>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import Icon from './Icon.vue'
import ThemeToggle from './ThemeToggle.vue'

const route = useRoute()
const { isAuthenticated } = useAuth()

const currentPage = computed(() => {
  return route.path.split('/').pop() || 'home'
})
</script>
