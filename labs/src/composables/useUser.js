import { ref } from 'vue'

const STORAGE_KEY = 'user-profile'

export function useUser() {
  const name = ref('')

  const loadUser = () => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      name.value = saved
    }
  }

  const saveUser = () => {
    localStorage.setItem(STORAGE_KEY, name.value)
  }

  loadUser()

  return {
    name,
    saveUser
  }
}
