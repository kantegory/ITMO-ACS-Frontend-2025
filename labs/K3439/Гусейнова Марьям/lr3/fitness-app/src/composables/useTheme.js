import { ref, onMounted, watch } from 'vue'

export function useTheme() {
  const isDark = ref(false)

  const initializeTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark' || savedTheme === 'light') {
      // Используем сохраненную тему пользователя
      isDark.value = savedTheme === 'dark'
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      isDark.value = prefersDark
    }
    updateTheme()
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    // Сохраняем только когда пользователь явно переключил
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    updateTheme()
  }

  const updateTheme = () => {
    if (isDark.value) {
      document.body.classList.add('dark-theme')
    } else {
      document.body.classList.remove('dark-theme')
    }
  }

  onMounted(() => {
    initializeTheme()
  })

  watch(isDark, updateTheme)

  return {
    isDark,
    toggleTheme,
    initializeTheme
  }
}