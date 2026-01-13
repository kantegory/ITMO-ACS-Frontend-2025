import { ref, onMounted } from 'vue'

export function useTheme() {
  const theme = ref('light')

  const applyTheme = () => {
    if (theme.value === 'dark') {
      document.body.classList.add('dark-theme')
    } else {
      document.body.classList.remove('dark-theme')
    }
    localStorage.setItem('theme', theme.value)
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    applyTheme()
  }

  onMounted(() => {
    theme.value = localStorage.getItem('theme') || 'light'
    applyTheme()
  })

  return {
    theme,
    toggleTheme
  }
}
