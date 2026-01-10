<template>
  <button
    type="button"
    class="btn btn-outline-light theme-toggle-btn d-inline-flex align-items-center"
    :aria-pressed="isDark"
    @click="toggleTheme"
  >
    <Icon 
      :name="isDark ? 'sun' : 'moon'" 
      size="md" 
      extra-class="me-2 icon-inline"
    />
    <span>{{ isDark ? 'Светлая тема' : 'Тёмная тема' }}</span>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme'
import Icon from './Icon.vue'

const { theme, isDark, toggleTheme } = useTheme()
</script>
