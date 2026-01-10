/**
 * Утилита для форматирования дат
 */

/**
 * Форматирует дату в читаемый формат (1 дек 2025)
 * @param {string|Date} date - Дата в формате строки (YYYY-MM-DD) или объект Date
 * @returns {string} - Отформатированная дата
 */
export function formatDate(date) {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? new Date(date + 'T00:00:00') : date
  
  if (isNaN(dateObj.getTime())) {
    return date // Возвращаем исходную строку, если дата невалидна
  }
  
  const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
  const day = dateObj.getDate()
  const month = months[dateObj.getMonth()]
  const year = dateObj.getFullYear()
  
  return `${day} ${month} ${year}`
}

/**
 * Форматирует дату в полный формат (1 декабря 2025)
 * @param {string|Date} date - Дата
 * @returns {string} - Отформатированная дата
 */
export function formatDateFull(date) {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? new Date(date + 'T00:00:00') : date
  
  if (isNaN(dateObj.getTime())) {
    return date
  }
  
  const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 
                  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
  const day = dateObj.getDate()
  const month = months[dateObj.getMonth()]
  const year = dateObj.getFullYear()
  
  return `${day} ${month} ${year}`
}
