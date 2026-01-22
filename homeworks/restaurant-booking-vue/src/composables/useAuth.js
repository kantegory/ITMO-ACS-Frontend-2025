import { ref } from 'vue'

export const currentUser = ref(JSON.parse(localStorage.getItem('currentUser')) || null)

export function login(user) {
  localStorage.setItem('currentUser', JSON.stringify(user))
  currentUser.value = user
}

export function logout() {
  localStorage.removeItem('currentUser')
  currentUser.value = null
}
