import {ref} from 'vue'

const toasts = ref([])
let toastId = 0

export function useToast() {
  const showToast = (message, type = 'info') => {
    const id = toastId++
    toasts.value.push({id, message, type})

    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id)
    }, 3000)
  }

  const removeToast = (id) => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return {
    toasts,
    showToast,
    removeToast
  }
}
