import { useThemeStore } from '@/stores/theme'
import { storeToRefs } from 'pinia'

export function useTheme() {
  const themeStore = useThemeStore()
  const { currentTheme } = storeToRefs(themeStore)

  const themes = [
    { name: 'light', icon: 'sun', label: 'Light Theme' },
    { name: 'dark', icon: 'moon', label: 'Dark Theme' },
    { name: 'pink', icon: 'heart', label: 'Pink Theme' }
  ]

  const setTheme = (theme) => themeStore.setTheme(theme)
  const initTheme = () => themeStore.initTheme()

  return { currentTheme, themes, setTheme, initTheme }
}
