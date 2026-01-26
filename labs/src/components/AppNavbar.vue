<template>
  <nav class="navbar navbar-expand-lg bg-light">
    <div class="container">
      <router-link class="navbar-brand" to="/">Рецепты</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Главная</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/search">Поиск</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/profile">Мой кабинет</router-link>
          </li>
        </ul>
        <div class="user-info">
          <span v-if="username">Привет, {{ username }}!</span>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useUser } from '@/composables/useUser.js'

const { username } = useUser()
</script>

<style scoped>
.user-info {
  font-weight: 500;
  padding: 0.5rem 1rem;
}
</style>