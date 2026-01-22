import { ref } from 'vue'
import { useStorage } from './useStorage'
import * as apartmentAPI from '../services/api'

/**
 * Composable для работы с недвижимостью
 * Предоставляет методы для загрузки, фильтрации и аренды недвижимости
 */
export function useProperties() {
  const { get, set } = useStorage()
  
  // Реактивное состояние
  const apartments = ref([])
  const loading = ref(false)
  const error = ref(null)

  /**
   * Загружает недвижимость из API
   * @param {Object} filters - Фильтры для поиска
   * @returns {Promise<Array>}
   */
  const loadApartments = async (filters = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const data = await apartmentAPI.getApartments(filters)
      
      // Добавляем изображение по умолчанию
      const properties = data.map(apt => ({
        ...apt,
        image: apt.images && apt.images.length > 0 
          ? apt.images[0] 
          : "https://via.placeholder.com/400x300?text=Нет+фото"
      }))
      
      apartments.value = properties
      
      // Сохраняем в localStorage для кэширования (только если нет фильтров)
      if (Object.keys(filters).length === 0) {
        set('apartments', data)
      }
      
      return properties
    } catch (e) {
      console.error('Ошибка загрузки недвижимости:', e)
      error.value = e
      
      // Пытаемся загрузить из кэша
      const cached = get('apartments') || []
      apartments.value = cached.map(apt => ({
        ...apt,
        image: apt.images && apt.images.length > 0 
          ? apt.images[0] 
          : "https://via.placeholder.com/400x300?text=Нет+фото"
      }))
      
      return apartments.value
    } finally {
      loading.value = false
    }
  }

  /**
   * Получает недвижимость по ID
   * @param {number} id - ID недвижимости
   * @returns {Promise<Object|null>}
   */
  const getApartmentById = async (id) => {
    try {
      return await apartmentAPI.getApartmentById(id)
    } catch (e) {
      console.error('Ошибка получения недвижимости:', e)
      // Пытаемся получить из кэша
      const cached = get('apartments') || []
      return cached.find(apt => apt.id === parseInt(id)) || null
    }
  }

  /**
   * Получает недвижимость пользователя
   * @param {number} userId - ID пользователя
   * @returns {Promise<Array>}
   */
  const getUserApartments = async (userId) => {
    try {
      return await apartmentAPI.getUserApartments(userId)
    } catch (e) {
      console.error('Ошибка получения недвижимости пользователя:', e)
      const cached = get('apartments') || []
      return cached.filter(apt => apt.ownerId === userId)
    }
  }

  /**
   * Получает арендованную недвижимость пользователя
   * @param {number} userId - ID пользователя
   * @returns {Promise<Array>}
   */
  const getRentedApartments = async (userId) => {
    try {
      return await apartmentAPI.getRentedApartments(userId)
    } catch (e) {
      console.error('Ошибка получения арендованной недвижимости:', e)
      const cached = get('rentedApartments') || []
      return cached.filter(rent => rent.tenantId === userId)
    }
  }

  /**
   * Арендовать недвижимость
   * @param {number} apartmentId - ID недвижимости
   * @param {number} userId - ID пользователя
   * @param {Object} rentData - Данные об аренде
   * @returns {Promise<Object>}
   */
  const rentApartment = async (apartmentId, userId, rentData) => {
    try {
      const result = await apartmentAPI.rentApartment(apartmentId, userId, rentData)
      
      // Обновляем кэш
      const rented = get('rentedApartments') || []
      rented.push(result)
      set('rentedApartments', rented)
      
      return result
    } catch (error) {
      console.error('Ошибка аренды недвижимости:', error)
      throw error
    }
  }

  /**
   * Получает недвижимость из кэша
   * @returns {Array}
   */
  const getCachedApartments = () => {
    return get('apartments') || []
  }

  return {
    apartments,
    loading,
    error,
    loadApartments,
    getApartmentById,
    getUserApartments,
    getRentedApartments,
    rentApartment,
    getCachedApartments
  }
}
