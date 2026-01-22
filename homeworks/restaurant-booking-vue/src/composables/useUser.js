// src/composables/useUser.js
import { ref } from 'vue'

const currentUser = ref(JSON.parse(localStorage.getItem('currentUser')) || null)

export function useUser() {
  const login = (user) => {
    currentUser.value = user
    localStorage.setItem('currentUser', JSON.stringify(user))
  }

  const logout = () => {
    currentUser.value = null
    localStorage.removeItem('currentUser')
  }

  return { currentUser, login, logout }
}
