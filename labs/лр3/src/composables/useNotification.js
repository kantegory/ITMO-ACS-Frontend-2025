import { ref } from 'vue'

const notifications = ref([])
let notificationId = 0

export function useNotification() {
  const showNotification = (message, type = 'info', duration = 5000) => {
    const id = ++notificationId
    notifications.value.push({ id, message, type, show: true })
    setTimeout(() => removeNotification(id), duration)
    return id
  }

  const removeNotification = (id) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) notifications.value.splice(index, 1)
  }

  const success = (message) => showNotification(message, 'success')
  const error = (message) => showNotification(message, 'danger')
  const info = (message) => showNotification(message, 'info')
  const warning = (message) => showNotification(message, 'warning')

  return { notifications, showNotification, removeNotification, success, error, info, warning }
}
