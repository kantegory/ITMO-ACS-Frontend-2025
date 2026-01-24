import { ref } from 'vue'
import { useDataService } from './useDataService'

const currentUser = ref(null)

export function useAuth() {
  const { withStringId } = useDataService()

  function getCurrentUser() {
    if (currentUser.value) return currentUser.value
    
    const raw = localStorage.getItem('rental_currentUser')
    if (!raw) return null
    
    try {
      const parsed = JSON.parse(raw)
      const normalized = withStringId(parsed)
      if (normalized) {
        currentUser.value = normalized
        return normalized
      }
    } catch (err) {
      console.warn('Не удалось распарсить сохранённого пользователя', err)
    }
    
    localStorage.removeItem('rental_currentUser')
    return null
  }

  function setCurrentUser(user) {
    const normalized = withStringId(user)
    if (!normalized) return
    
    currentUser.value = normalized
    localStorage.setItem('rental_currentUser', JSON.stringify(normalized))
  }

  function logout() {
    currentUser.value = null
    localStorage.removeItem('rental_currentUser')
  }

  return {
    currentUser,
    getCurrentUser,
    setCurrentUser,
    logout
  }
}

