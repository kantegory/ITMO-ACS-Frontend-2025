<template>
  <div id="app">
    <Navbar />
    <div class="container py-4">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
// компонент навигации всегда виден сверху
import Navbar from './components/Navbar.vue'
</script>

<style>
/* стили подключаются позже */
</style>