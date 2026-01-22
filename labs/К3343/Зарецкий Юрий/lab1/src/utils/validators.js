/**
 * Утилиты для валидации форм
 */

/**
 * Проверяет совпадение паролей
 * @param {string} password - Пароль
 * @param {string} confirmPassword - Подтверждение пароля
 * @returns {boolean} - true если пароли совпадают
 */
export function validatePasswordMatch(password, confirmPassword) {
  return password === confirmPassword
}

/**
 * Проверяет минимальную длину пароля
 * @param {string} password - Пароль
 * @param {number} minLength - Минимальная длина (по умолчанию 8)
 * @returns {boolean} - true если пароль соответствует требованиям
 */
export function validatePasswordLength(password, minLength = 8) {
  return password.length >= minLength
}

/**
 * Проверяет валидность email
 * @param {string} email - Email адрес
 * @returns {boolean} - true если email валиден
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Проверяет валидность телефона (российский формат)
 * @param {string} phone - Номер телефона
 * @returns {boolean} - true если телефон валиден
 */
export function validatePhone(phone) {
  const phoneRegex = /^(\+7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

/**
 * Проверяет, что дата начала раньше даты окончания
 * @param {string|Date} startDate - Дата начала
 * @param {string|Date} endDate - Дата окончания
 * @returns {boolean} - true если даты валидны
 */
export function validateDateRange(startDate, endDate) {
  if (!startDate || !endDate) return false
  
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return false
  
  return end > start
}

/**
 * Проверяет, что дата не в прошлом
 * @param {string|Date} date - Дата
 * @returns {boolean} - true если дата не в прошлом
 */
export function validateDateNotPast(date) {
  if (!date) return false
  
  const dateObj = new Date(date)
  if (isNaN(dateObj.getTime())) return false
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return dateObj >= today
}
