import { ref } from 'vue'

/**
 * Composable для работы с localStorage
 * Предоставляет реактивные методы для сохранения, получения и удаления данных
 */
export function useStorage() {
  /**
   * Сохраняет данные в localStorage
   * @param {string} key - Ключ для сохранения
   * @param {any} data - Данные для сохранения (будут сериализованы в JSON)
   */
  const set = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (e) {
      console.error('Ошибка сохранения в localStorage:', e)
    }
  }

  /**
   * Получает данные из localStorage
   * @param {string} key - Ключ для получения
   * @returns {any|null} - Данные или null, если не найдены
   */
  const get = (key) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (e) {
      console.error('Ошибка чтения из localStorage:', e)
      return null
    }
  }

  /**
   * Удаляет данные из localStorage
   * @param {string} key - Ключ для удаления
   */
  const remove = (key) => {
    try {
      localStorage.removeItem(key)
    } catch (e) {
      console.error('Ошибка удаления из localStorage:', e)
    }
  }

  /**
   * Очищает весь localStorage
   */
  const clear = () => {
    try {
      localStorage.clear()
    } catch (e) {
      console.error('Ошибка очистки localStorage:', e)
    }
  }

  /**
   * Создает реактивную ссылку на значение в localStorage
   * @param {string} key - Ключ для отслеживания
   * @param {any} defaultValue - Значение по умолчанию
   * @returns {Ref} - Реактивная ссылка
   */
  const useReactiveStorage = (key, defaultValue = null) => {
    const stored = get(key)
    const value = ref(stored !== null ? stored : defaultValue)

    // Отслеживаем изменения и сохраняем в localStorage
    const updateStorage = () => {
      set(key, value.value)
    }

    return {
      value,
      updateStorage
    }
  }

  return {
    set,
    get,
    remove,
    clear,
    useReactiveStorage
  }
}
