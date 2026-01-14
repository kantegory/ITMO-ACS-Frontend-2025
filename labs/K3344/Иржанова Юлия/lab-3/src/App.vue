<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div style="padding: 16px">
    <nav style="display: flex; gap: 12px; margin-bottom: 16px">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/catalog">Catalog</RouterLink>
      <RouterLink to="/login">Login</RouterLink>
      <RouterLink to="/register">Register</RouterLink>
      <RouterLink to="/profile">Profile</RouterLink>
    </nav>

    <RouterView />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
