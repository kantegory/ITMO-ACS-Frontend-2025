<template>
  <button
    type="button"
    class="btn btn-outline-light theme-toggle"
    :aria-pressed="isDark ? 'true' : 'false'"
    @click="toggleTheme"
  >
    {{ isDark ? 'Светлая' : 'Тёмная' }}
  </button>
</template>

<script>
import { useColorScheme } from '@/composables/useColorScheme'

export default {
  name: 'ThemeToggle',
  setup() {
    const { isDark, toggleTheme } = useColorScheme()
    return { isDark, toggleTheme }
  },
}
</script>
