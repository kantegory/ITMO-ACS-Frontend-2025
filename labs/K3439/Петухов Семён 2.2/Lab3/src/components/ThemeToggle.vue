<template>
  <button
    id="themeToggle"
    class="btn btn-sm btn-outline-secondary theme-toggle btn-icon"
    type="button"
    :aria-pressed="isDark"
    :aria-label="toggleLabel"
    :title="toggleLabel"
    @click="toggleTheme"
  >
    <svg class="icon theme-toggle-icon" aria-hidden="true" focusable="false">
      <use v-if="!isDark" href="#icon-moon"></use>
      <use v-else href="#icon-sun"></use>
    </svg>
    <span class="visually-hidden">{{ toggleLabel }}</span>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { currentTheme, toggleTheme: toggle } = useTheme()

const isDark = computed(() => currentTheme.value === 'dark')
const toggleLabel = computed(() => isDark.value ? 'Включить светлую тему' : 'Включить тёмную тему')

function toggleTheme() {
  toggle()
}
</script>

