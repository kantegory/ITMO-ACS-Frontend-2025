<template>
  <div
      class="theme-toggle"
      :class="{ dark: isDark }"
      @click="toggleTheme"
  >
    <span class="label">{{ isDark ? 'Светлая тема' : 'Тёмная тема' }}</span>
    <div class="circle">
      <svg class="icon" viewBox="0 0 24 24">
        <use :href="iconHref" />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme } = useTheme()

const iconHref = computed(() =>
    isDark.value
        ? '/assets/icons.svg#icon-moon'
        : '/assets/icons.svg#icon-sun'
)
</script>