<template>
  <button
    class="btn btn-outline-light btn-sm theme-toggle"
    @click="toggleTheme"
    :aria-label="currentTheme === 'dark' ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'"
  >
    <span class="icon icon-sm">
      <svg><use :href="currentTheme === 'dark' ? '#icon-sun' : '#icon-moon'"></use></svg>
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { currentTheme, toggleTheme } = useTheme()
</script>

