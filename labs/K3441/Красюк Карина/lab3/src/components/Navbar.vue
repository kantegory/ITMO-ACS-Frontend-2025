<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow-sm" role="navigation" aria-label="Основная навигация">
    <div class="container">
      <router-link class="navbar-brand fw-bold" to="/" aria-label="JobFinder - главная страница">
        JobFinder
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
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" :class="{ active: $route.path === '/' }" to="/">
              Поиск вакансий
            </router-link>
          </li>
        </ul>
        <div class="d-flex gap-2 align-items-center">
          <ThemeToggle />
          <template v-if="isAuthenticated">
            <span class="d-flex align-items-center gap-3 text-light small">
              <span aria-label="Текущий пользователь">
                <span class="icon icon-sm me-1">
                  <svg><use :href="isCandidate ? '#icon-user' : '#icon-building'"></use></svg>
                </span>
                {{ isCandidate ? `Соискатель: ${user.name}` : `Работодатель: ${user.companyName}` }}
              </span>
              <button @click="handleLogout" class="btn btn-outline-light btn-sm" aria-label="Выйти из личного кабинета">
                Выйти
              </button>
            </span>
          </template>
          <template v-else>
            <router-link to="/login" class="btn btn-outline-light btn-sm">
              <span class="icon icon-sm me-1">
                <svg><use href="#icon-user"></use></svg>
              </span>
              Вход
            </router-link>
            <router-link to="/register" class="btn btn-primary btn-sm">Регистрация</router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import ThemeToggle from './ThemeToggle.vue'

const router = useRouter()
const { user, isAuthenticated, isCandidate, logout } = useAuth()

const handleLogout = () => {
  logout()
}
</script>

