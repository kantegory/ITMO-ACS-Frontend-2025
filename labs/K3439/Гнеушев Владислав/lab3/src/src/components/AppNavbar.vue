<template>
  <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">
    <symbol id="icon-home" viewBox="0 0 24 24">
      <path d="M3 11.25 12 3l9 8.25V21a1 1 0 0 1-1 1h-5.5a.5.5 0 0 1-.5-.5V15h-4v6.5a.5.5 0 0 1-.5.5H4a1 1 0 0 1-1-1v-8.75Z"/>
    </symbol>
    <symbol id="icon-dumbbell" viewBox="0 0 24 24">
      <path d="M4 7h2v10H4V7Zm3 2h2v6H7V9Zm8 0h2v6h-2V9Zm3-2h2v10h-2V7ZM9 11h6v2H9v-2Z"/>
    </symbol>
    <symbol id="icon-user" viewBox="0 0 24 24">
      <path d="M12 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 10c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z"/>
    </symbol>
  </svg>

  <nav class="navbar navbar-expand-lg navbar-dark bg-primary" role="navigation" aria-label="Основная навигация">
    <div class="container">
      <router-link class="navbar-brand d-flex align-items-center gap-2" to="/">
        <svg class="icon" aria-hidden="true" focusable="false">
          <use href="#icon-home"></use>
        </svg>
        <span>Good fitness</span>
      </router-link>
      <div class="d-flex align-items-center ms-auto gap-2">
        <div class="navbar-nav">
          <router-link class="nav-link" to="/">
            <svg class="icon icon-nav" aria-hidden="true" focusable="false">
              <use href="#icon-home"></use>
            </svg>
            <span>Главная</span>
          </router-link>
          <router-link class="nav-link" to="/workouts">
            <svg class="icon icon-nav" aria-hidden="true" focusable="false">
              <use href="#icon-dumbbell"></use>
            </svg>
            <span>Тренировки</span>
          </router-link>
          <router-link class="nav-link" to="/blog">Блог</router-link>
          <router-link class="nav-link" to="/profile">
            <svg class="icon icon-nav" aria-hidden="true" focusable="false">
              <use href="#icon-user"></use>
            </svg>
            <span>Профиль</span>
          </router-link>
          <router-link class="nav-link" to="/login" v-if="!currentUser">Вход</router-link>
          <a class="nav-link" href="#" @click.prevent="handleLogout" v-else>Выход</a>
        </div>
        <button 
          class="btn theme-toggle-btn" 
          type="button" 
          aria-label="Переключить тему" 
          :aria-pressed="theme === 'dark'"
          @click="toggleTheme"
        >
          {{ theme === 'dark' ? 'Светлая тема' : 'Тёмная тема' }}
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useTheme } from '../composables/useTheme';
import { useAuth } from '../composables/useAuth';
import { useRouter } from 'vue-router';

const { theme, toggleTheme } = useTheme();
const { currentUser, logout } = useAuth();
const router = useRouter();

function handleLogout() {
  logout();
  router.push('/login');
}
</script>
