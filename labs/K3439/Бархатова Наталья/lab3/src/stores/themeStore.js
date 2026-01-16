import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: 'light'
  }),
  actions: {
    initTheme() {
      const saved = localStorage.getItem('theme')
      if (saved) {
        this.theme = saved
      }
      this.applyTheme()
    },
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', this.theme)
      this.applyTheme()
    },
    applyTheme() {
      const link = document.getElementById('theme-style')
      if (link) {
        link.href = `src/assets/css/theme-${this.theme}.css`
      }
    }
  }
})
