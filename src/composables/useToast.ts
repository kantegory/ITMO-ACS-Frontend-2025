import { Toast } from 'bootstrap'

export function useToast() {
  const showToast = (message: string, type: 'success' | 'danger' | 'primary' = 'primary') => {
    let toastContainer = document.getElementById('toastContainer')
    if (!toastContainer) {
      toastContainer = document.createElement('div')
      toastContainer.id = 'toastContainer'
      toastContainer.classList.add('position-fixed', 'top-0', 'end-0', 'p-3', 'toast-container')
      toastContainer.style.zIndex = '9999'
      document.body.appendChild(toastContainer)
    }

    const toastEl = document.createElement('div')
    toastEl.className = `toast align-items-center text-bg-${type} border-0`
    toastEl.setAttribute('role', 'alert')
    toastEl.setAttribute('aria-live', 'assertive')
    toastEl.setAttribute('aria-atomic', 'true')
    toastEl.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `
    toastContainer.appendChild(toastEl)

    const toast = new Toast(toastEl, { delay: 3000 })
    toast.show()
    toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove())
  }

  return {
    showToast
  }
}

