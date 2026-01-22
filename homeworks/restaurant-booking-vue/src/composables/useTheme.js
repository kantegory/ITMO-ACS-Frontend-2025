import { ref, onMounted } from 'vue'

export function useTheme() {
  const theme = ref(localStorage.getItem('theme') || 'light')

  const applyTheme = () => {
    document.body.classList.remove('light', 'dark')
    document.body.classList.add(theme.value)
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    localStorage.setItem('theme', theme.value)
    applyTheme()
  }

  onMounted(() => applyTheme())

  return { theme, toggleTheme }
}
