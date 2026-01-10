import { ref, computed } from 'vue'
import { useStorage } from './useStorage'
import { useRouter } from 'vue-router'
import { useApi } from './useApi'
import * as userAPI from '../services/api'

/**
 * Composable для управления авторизацией
 * Предоставляет реактивное состояние пользователя и методы для входа/выхода
 */
export function useAuth() {
  const { get, set, remove } = useStorage()
  const router = useRouter()
  const { api } = useApi()

  // Реактивное состояние текущего пользователя
  const currentUser = ref(get('currentUser'))
  const authToken = ref(get('authToken'))

  // Вычисляемое свойство для проверки авторизации
  const isAuthenticated = computed(() => {
    return authToken.value !== null && currentUser.value !== null
  })

  /**
   * Вход в систему
   * @param {string} email - Email или имя пользователя
   * @param {string} password - Пароль
   * @returns {Promise<Object>} - Пользователь и токен
   */
  const login = async (email, password) => {
    try {
      const { user, token } = await userAPI.login(email, password)
      
      // Сохраняем токен и пользователя
      set('authToken', token)
      set('currentUser', user)
      
      // Обновляем реактивное состояние
      currentUser.value = user
      authToken.value = token
      
      return { user, token }
    } catch (error) {
      console.error('Ошибка авторизации:', error)
      throw error
    }
  }

  /**
   * Регистрация нового пользователя
   * @param {Object} userData - Данные пользователя
   * @returns {Promise<Object>} - Новый пользователь и токен
   */
  const register = async (userData) => {
    try {
      const { user, token } = await userAPI.register(userData)
      
      // Сохраняем токен и пользователя
      set('authToken', token)
      set('currentUser', user)
      
      // Обновляем реактивное состояние
      currentUser.value = user
      authToken.value = token
      
      return { user, token }
    } catch (error) {
      console.error('Ошибка регистрации:', error)
      throw error
    }
  }

  /**
   * Выход из системы
   */
  const logout = () => {
    remove('authToken')
    remove('currentUser')
    
    // Обновляем реактивное состояние
    currentUser.value = null
    authToken.value = null
    
    // Перенаправляем на главную страницу
    router.push('/')
  }

  /**
   * Обновляет текущего пользователя
   * @param {Object} user - Пользователь
   */
  const setUser = (user) => {
    set('currentUser', user)
    currentUser.value = user
  }

  /**
   * Загружает пользователей из API
   * @returns {Promise<Array>}
   */
  const loadUsers = async () => {
    try {
      const users = await userAPI.getUsers()
      set('users', users)
      return users
    } catch (e) {
      console.error('Ошибка загрузки пользователей:', e)
      // Пытаемся загрузить из кэша
      return get('users') || []
    }
  }

  return {
    currentUser,
    authToken,
    isAuthenticated,
    login,
    register,
    logout,
    setUser,
    loadUsers
  }
}
