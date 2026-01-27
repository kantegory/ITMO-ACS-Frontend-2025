import { ref } from 'vue'

export function useNotifications() {
  const notifications = ref([])

  const show = (message, type = 'success', duration = 5000) => {
    const id = Date.now()
    const notification = { id, message, type }
    notifications.value.push(notification)

    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }

    return id
  }

  const remove = (id) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const success = (message, duration) => show(message, 'success', duration)
  const error = (message, duration) => show(message, 'error', duration)
  const warning = (message, duration) => show(message, 'warning', duration)
  const info = (message, duration) => show(message, 'info', duration)

  return {
    notifications,
    show,
    remove,
    success,
    error,
    warning,
    info
  }
}

