import { ref, computed, watch } from 'vue'

type Theme = 'auto' | 'light' | 'dark'

const currentTheme = ref<Theme>('auto')

export function useTheme() {
  const themes: Theme[] = ['auto', 'light', 'dark']

  const getStoredTheme = (): Theme | null => {
    const stored = localStorage.getItem('theme') as Theme
    return themes.includes(stored) ? stored : null
  }

  const storeTheme = (theme: Theme) => {
    localStorage.setItem('theme', theme)
  }

  const getEffectiveTheme = computed(() => {
    if (currentTheme.value === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return currentTheme.value
  })

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement

    root.removeAttribute('data-theme')

    if (theme !== 'auto') {
      root.setAttribute('data-theme', theme)
    }

    updateMetaThemeColor(theme)
  }

  const updateMetaThemeColor = (theme: Theme) => {
    const effectiveTheme = theme === 'auto' ? getEffectiveTheme.value : theme
    let metaThemeColor = document.querySelector('meta[name="theme-color"]')

    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta')
      metaThemeColor.setAttribute('name', 'theme-color')
      document.head.appendChild(metaThemeColor)
    }

    metaThemeColor.setAttribute('content', effectiveTheme === 'dark' ? '#1a1a1a' : '#ffffff')
  }

  const cycleTheme = () => {
    const currentIndex = themes.indexOf(currentTheme.value)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  const setTheme = (theme: Theme) => {
    if (!themes.includes(theme)) return

    currentTheme.value = theme
    storeTheme(theme)
    applyTheme(theme)

    window.dispatchEvent(new CustomEvent('themeChanged', {
      detail: { theme: theme, effectiveTheme: getEffectiveTheme.value }
    }))
  }

  const getNextThemeIcon = computed(() => {
    const currentIndex = themes.indexOf(currentTheme.value)
    const nextIndex = (currentIndex + 1) % themes.length
    const nextTheme = themes[nextIndex]

    const icons = {
      'auto': '🌓',
      'light': '☀️',
      'dark': '🌙'
    }

    return icons[nextTheme]
  })

  const getThemeTitle = computed(() => {
    const currentIndex = themes.indexOf(currentTheme.value)
    const nextIndex = (currentIndex + 1) % themes.length
    const nextTheme = themes[nextIndex]

    return `Switch to ${nextTheme} theme (currently: ${currentTheme.value})`
  })

  const initTheme = () => {
    const stored = getStoredTheme()
    currentTheme.value = stored || 'auto'
    applyTheme(currentTheme.value)

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', () => {
      if (currentTheme.value === 'auto') {
        applyTheme('auto')
      }
    })
  }

  watch(currentTheme, (newTheme) => {
    applyTheme(newTheme)
  })

  return {
    currentTheme: computed(() => currentTheme.value),
    effectiveTheme: getEffectiveTheme,
    nextThemeIcon: getNextThemeIcon,
    themeTitle: getThemeTitle,
    cycleTheme,
    setTheme,
    initTheme
  }
}