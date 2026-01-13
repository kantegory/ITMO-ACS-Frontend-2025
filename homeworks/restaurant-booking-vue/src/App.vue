<script setup>
import Navbar from './components/Navbar.vue'
import { useTheme } from './composables/useTheme'
import { RouterView } from 'vue-router'

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <div id="app">
    <Navbar :theme="theme" :toggleTheme="toggleTheme" />
    <RouterView />
  </div>
</template>

<style>
/* ===== ОСНОВА (КРИТИЧНО) ===== */
html,
body,
#app {
  min-height: 100vh;
  margin: 0;
  padding: 0;
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s ease, color 0.3s ease;
}


/* ===== КНОПКИ ===== */
.btn-primary {
  background: var(--btn-primary-bg);
  color: var(--btn-primary-text);
  border: none;
}

.btn-secondary {
  background: var(--btn-secondary-bg);
  color: var(--btn-secondary-text);
  border: none;
}

/* outline кнопка (исправлено) */
.btn-outline-primary {
  background: transparent;
  border: 1px solid var(--btn-primary-text);
  color: var(--btn-primary-text);
}

.btn-outline-primary:hover {
  background: var(--btn-primary-bg);
  color: #fff;
}

/* ===== КАРТОЧКИ (Bootstrap FIX) ===== */
.card {
  background-color: var(--card-bg);
  color: var(--text-color);
  box-shadow: 0 4px 12px var(--card-shadow);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

/* ===== NAVBAR ===== */
.navbar {
  background-color: var(--navbar-bg);
  color: var(--navbar-text);
}

.navbar a,
.navbar-brand {
  color: var(--navbar-text) ;
}

body.light {
  --bg-color: #f4f6f8;
  --text-color: #1f2933;

  --card-bg: #ffffff;
  --card-shadow: rgba(0, 0, 0, 0.08);

  --btn-primary-bg: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
  --btn-primary-text: #ffffff;

  --btn-secondary-bg: #e5e7eb;
  --btn-secondary-text: #1f2933;

  --navbar-bg: #ffffff;
  --navbar-text: #1f2933;
}

body.dark {
  --bg-color: #181a1b;
  --text-color: #e4e6eb;

  --card-bg: #222425;
  --card-shadow: rgba(0, 0, 0, 0.45);

  --btn-primary-bg: linear-gradient(90deg, #8e2de2 0%, #4a00e0 100%);
  --btn-primary-text: #ffffff;

  --btn-secondary-bg: #2f3133;
  --btn-secondary-text: #e4e6eb;

  --navbar-bg: #1f2123;
  --navbar-text: #e4e6eb;
}

body.dark .text-muted {
  color: #cfcfcf !important;
}
</style>

