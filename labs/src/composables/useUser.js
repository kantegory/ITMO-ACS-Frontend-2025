import { ref, onMounted } from 'vue'

export function useUser() {
  const username = ref(localStorage.getItem('myuser') || '')

  const updateUser = (newName) => {
    if (newName) {
      localStorage.setItem('myuser', newName)
      username.value = newName
    } else {
      localStorage.removeItem('myuser')
      username.value = ''
    }
  }

  // При загрузке страницы проверяем localStorage
  onMounted(() => {
    username.value = localStorage.getItem('myuser') || ''
  })

  return { username, updateUser }
}