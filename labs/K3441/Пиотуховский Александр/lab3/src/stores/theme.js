import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref(localStorage.getItem('theme') || 'orange')

  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'orange' ? 'purple' : 'orange'
    localStorage.setItem('theme', currentTheme.value)

    if (currentTheme.value === 'purple') {
      document.body.classList.add('theme-purple')
    } else {
      document.body.classList.remove('theme-purple')
    }
  }

  const initTheme = () => {
    if (currentTheme.value === 'purple') {
      document.body.classList.add('theme-purple')
    }
  }

  return {
    currentTheme,
    toggleTheme,
    initTheme
  }
})
