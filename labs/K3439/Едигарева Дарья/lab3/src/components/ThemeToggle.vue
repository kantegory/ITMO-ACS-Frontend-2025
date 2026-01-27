<template>
  <button
    type="button"
    class="btn btn-outline-light btn-sm"
    :aria-pressed="isDark ? 'true' : 'false'"
    @click="toggleTheme"
  >
    {{ isDark ? 'Светлая' : 'Тёмная' }}
  </button>
</template>

<script>
import { useTheme } from '@/composables/useTheme'

export default {
  name: 'ThemeToggle',
  setup() {
    const { isDark, toggleTheme } = useTheme()

    return { isDark, toggleTheme }
  },
}
</script>
