// composable для управления авторизацией через localstorage
import { ref, onMounted } from 'vue'

export function useAuth() {
  const user = ref(null)

  // при загрузке компонента читаем данные пользователя
  onMounted(() => {
    const storedUser = localStorage.getItem('restorator_user')
    if (storedUser) {
      user.value = JSON.parse(storedUser)
    }
  })

  // выход из аккаунта
  function logout() {
    localStorage.removeItem('restorator_user')
    user.value = null
    window.location.href = '/'
  }

  return { user, logout }
}