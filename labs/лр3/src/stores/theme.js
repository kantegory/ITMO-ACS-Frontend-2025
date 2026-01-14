import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    currentTheme: 'light'
  }),

  actions: {
    setTheme(theme) {
      this.currentTheme = theme
      document.documentElement.setAttribute('data-theme', theme)
      document.body.setAttribute('data-theme', theme)
    },

    initTheme() {
      this.setTheme(this.currentTheme)
    }
  },

  persist: true
})
