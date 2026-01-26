<template>
    <AppNavbar />

  <div class="container mt-4">
    <h1>Страница рецепта (заглушка)</h1>
    <p>ID рецепта: {{ route.params.id }}</p>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import AppNavbar from '@/components/AppNavbar.vue'

const route = useRoute()
</script>