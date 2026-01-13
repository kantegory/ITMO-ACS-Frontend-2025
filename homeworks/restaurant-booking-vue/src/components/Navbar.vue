<template>
  <nav class="navbar navbar-light">
    <div class="container">
      <RouterLink class="navbar-brand" to="/">RestaurantBooking</RouterLink>

      <button class="btn btn-secondary themed-btn" @click="toggleTheme">
        {{ theme === 'dark' ? 'Светлая тема' : 'Тёмная тема' }}
      </button>

      <div class="d-flex gap-2">
        <RouterLink to="/login" class="btn btn-outline-primary themed-btn">
          Вход
        </RouterLink>
        <RouterLink to="/register" class="btn btn-primary themed-btn">
          Регистрация
        </RouterLink>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useTheme } from '../composables/useTheme'
import { RouterLink } from 'vue-router'

const { theme, toggleTheme } = useTheme()
</script>
