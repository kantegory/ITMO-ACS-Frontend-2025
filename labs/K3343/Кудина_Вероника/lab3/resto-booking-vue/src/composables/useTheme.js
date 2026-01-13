import { ref, watch } from 'vue'

export function useTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light'
  const isDark = ref(savedTheme === 'dark')

  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  watch(isDark, (newValue) => {
    const theme = newValue ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, { immediate: true })

  return {
    isDark,
    toggleTheme
  }
}
