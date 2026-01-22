import { ref, onMounted, computed } from 'vue'
import { useStorage } from './useStorage'

const THEMES = {
  light: 'light',
  dark: 'dark'
}

const STORAGE_KEY = 'theme'

/**
 * Composable для управления темой приложения
 * Предоставляет реактивное состояние темы и методы для переключения
 */
export function useTheme() {
  const { get, set } = useStorage()
  
  // Получаем системную тему
  const getSystemTheme = () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return THEMES.dark
    }
    return THEMES.light
  }

  // Инициализируем тему из localStorage или системную
  const storedTheme = get(STORAGE_KEY)
  const initialTheme = storedTheme || getSystemTheme()
  
  // Реактивное состояние темы
  const theme = ref(initialTheme)

  /**
   * Применяет тему к документу
   * @param {string} newTheme - Новая тема ('light' или 'dark')
   * @param {boolean} persist - Сохранять ли в localStorage
   */
  const applyTheme = (newTheme, persist = true) => {
    const safeTheme = newTheme === THEMES.dark ? THEMES.dark : THEMES.light
    
    // Применяем к документу
    document.documentElement.setAttribute('data-theme', safeTheme)
    document.documentElement.dataset.bsTheme = safeTheme === THEMES.dark ? 'dark' : 'light'
    
    // Обновляем реактивное состояние
    theme.value = safeTheme
    
    // Сохраняем в localStorage
    if (persist) {
      set(STORAGE_KEY, safeTheme)
    }
  }

  /**
   * Переключает тему
   */
  const toggleTheme = () => {
    const nextTheme = theme.value === THEMES.dark ? THEMES.light : THEMES.dark
    applyTheme(nextTheme)
  }

  /**
   * Устанавливает тему
   * @param {string} newTheme - Новая тема
   */
  const setTheme = (newTheme) => {
    applyTheme(newTheme)
  }

  // Инициализация при монтировании
  onMounted(() => {
    // Применяем начальную тему
    applyTheme(theme.value, Boolean(storedTheme))
    
    // Слушаем изменения системной темы
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      
      const handleSystemThemeChange = (event) => {
        // Если пользователь уже выбрал тему вручную — уважаем выбор
        if (get(STORAGE_KEY)) return
        applyTheme(event.matches ? THEMES.dark : THEMES.light, false)
      }
      
      // Современный способ
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleSystemThemeChange)
      } else {
        // Fallback для старых браузеров
        mediaQuery.addListener(handleSystemThemeChange)
      }
    }
  })

  // Вычисляемое свойство для проверки, является ли тема тёмной
  const isDark = computed(() => theme.value === THEMES.dark)

  return {
    theme,
    isDark,
    toggleTheme,
    setTheme,
    applyTheme
  }
}
