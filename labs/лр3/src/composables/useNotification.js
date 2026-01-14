import { ref } from 'vue'

const notifications = ref([])
let notificationId = 0

export function useNotification() {
  const showNotification = (message, type = 'info', duration = 3000) => {
    const id = ++notificationId
    
    // Удаляем старые уведомления того же типа (чтобы не копились)
    notifications.value = notifications.value.filter(n => n.type !== type || n.type === 'danger')
    
    notifications.value.push({ id, message, type, show: true })

    // Автоматически удаляем через duration миллисекунд
    setTimeout(() => {
      removeNotification(id)
    }, duration)

    return id
  }

  const removeNotification = (id) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  // Очистить все уведомления
  const clearAll = () => {
    notifications.value = []
  }

  const success = (message) => showNotification(message, 'success', 3000)
  const error = (message) => showNotification(message, 'danger', 5000)
  const info = (message) => showNotification(message, 'info', 2000)
  const warning = (message) => showNotification(message, 'warning', 4000)

  return { notifications, showNotification, removeNotification, clearAll, success, error, info, warning }
}
