<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <router-link class="navbar-brand" to="/">RestOrator</router-link>
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav ms-auto">
          <li v-if="!user" class="nav-item">
            <router-link class="nav-link" to="/login">Вход</router-link>
          </li>
          <li v-if="!user" class="nav-item">
            <router-link class="nav-link" to="/register">Регистрация</router-link>
          </li>
          <li v-if="user" class="nav-item">
            <router-link class="nav-link" to="/profile">Личный кабинет</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
// показываем разные ссылки в зависимости от того, авторизован ли пользователь
import { useAuth } from '@/composables/useAuth'

const { user } = useAuth()
</script>