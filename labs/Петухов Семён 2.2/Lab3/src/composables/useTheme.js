import { ref } from 'vue'

const THEME_STORAGE_KEY = 'rental_theme'
const DEFAULT_THEME = 'light'
const currentTheme = ref(DEFAULT_THEME)

function initTheme() {
  try {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    const theme = storedTheme === 'dark' ? 'dark' : DEFAULT_THEME
    currentTheme.value = theme
    document.documentElement.setAttribute('data-theme', theme)
  } catch (err) {
    console.warn('Не удалось прочитать тему из localStorage', err)
    document.documentElement.setAttribute('data-theme', DEFAULT_THEME)
  }
}

initTheme()

export function useTheme() {
  function setTheme(theme) {
    currentTheme.value = theme
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch (err) {
      console.warn('Не удалось сохранить тему', err)
    }
  }

  function toggleTheme() {
    const nextTheme = currentTheme.value === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
  }

  return {
    currentTheme,
    setTheme,
    toggleTheme,
    initTheme
  }
}

