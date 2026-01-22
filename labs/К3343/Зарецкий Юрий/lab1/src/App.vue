<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useTheme } from '@/composables/useTheme'

// Инициализируем тему при загрузке приложения
const { applyTheme } = useTheme()

onMounted(() => {
  // Тема уже инициализирована в useTheme composable
})
</script>
