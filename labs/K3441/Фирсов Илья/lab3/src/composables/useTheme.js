import { computed, onMounted, ref, watch } from 'vue'

const THEME_KEY = 'careerTheme'

export const useTheme = () => {
  const theme = ref('light')

  const applyTheme = (value) => {
    const next = value === 'dark' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem(THEME_KEY, next)
    theme.value = next
  }

  const toggleTheme = () => {
    applyTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  onMounted(() => {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const saved = localStorage.getItem(THEME_KEY)
    applyTheme(saved || (prefersDark ? 'dark' : 'light'))
  })

  watch(theme, (value) => {
    document.documentElement.setAttribute('data-theme', value)
  })

  return {
    theme,
    isDark: computed(() => theme.value === 'dark'),
    toggleTheme,
  }
}
