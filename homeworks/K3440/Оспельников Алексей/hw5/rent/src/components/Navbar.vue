<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container">
      <router-link class="navbar-brand" to="/">RentSpace</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li v-if="!isLoggedIn()" class="nav-item"><router-link class="nav-link" to="/login">Вход</router-link></li>
          <li v-if="!isLoggedIn()" class="nav-item"><router-link class="nav-link" to="/register">Регистрация</router-link></li>
          <li v-if="isLoggedIn()" class="nav-item"><router-link class="nav-link" to="/profile">Личный кабинет</router-link></li>
          <li class="nav-item">
            <button @click="toggleTheme" class="btn btn-outline-primary">{{ currentTheme === 'light' ? 'Тёмная тема' : 'Светлая тема' }}</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { useAuth } from '../composables/useAuth';
import { useTheme } from '../composables/useTheme';

export default {
  setup() {
    const auth = useAuth();
    const { currentTheme, toggleTheme } = useTheme();
    return { isLoggedIn: auth.isLoggedIn, currentTheme, toggleTheme };
  }
};
</script>
