import { inject } from 'vue'

export function useNotification() {
  const successModal = inject('successModal')

  const showSuccess = (message, redirectRoute = null) => {
    if (successModal.value) {
      successModal.value.showSuccess(message, redirectRoute)
    }
  }

  const showError = (title, message) => {
    if (successModal.value) {
      successModal.value.showError(title, message)
    }
  }

  return {
    showSuccess,
    showError
  }
}