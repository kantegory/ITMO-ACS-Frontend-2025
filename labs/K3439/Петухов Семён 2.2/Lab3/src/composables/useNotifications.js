// Simplified notifications using Bootstrap modals and toasts
// In a real Vue app, you might want to use a more sophisticated notification system

let modalEl = null
let modalInstance = null

export function useNotifications() {
  function createModal() {
    if (modalEl) return modalEl
    
    modalEl = document.createElement('div')
    modalEl.className = 'modal fade'
    modalEl.id = 'frDialogModal'
    modalEl.tabIndex = -1
    modalEl.setAttribute('aria-hidden', 'true')
    modalEl.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">FastRent</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
          </div>
          <div class="modal-body"></div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-role="cancel">Отмена</button>
            <button type="button" class="btn btn-primary" data-role="confirm">Ок</button>
          </div>
        </div>
      </div>
    `
    document.body.appendChild(modalEl)
    return modalEl
  }

  function createToastContainer() {
    let container = document.querySelector('.toast-container')
    if (container) return container
    
    container = document.createElement('div')
    container.className = 'toast-container position-fixed top-0 end-0 p-3'
    container.style.zIndex = '1080'
    container.setAttribute('aria-live', 'polite')
    container.setAttribute('aria-atomic', 'true')
    document.body.appendChild(container)
    return container
  }

  function showError(message, title = 'Ошибка') {
    if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
      const container = createToastContainer()
      const toastEl = document.createElement('div')
      toastEl.className = 'toast align-items-center text-bg-danger border-0 shadow'
      toastEl.setAttribute('role', 'alert')
      toastEl.setAttribute('aria-live', 'assertive')
      toastEl.setAttribute('aria-atomic', 'true')
      toastEl.innerHTML = `
        <div class="d-flex">
          <div class="toast-body">
            <strong class="d-block">${title}</strong>
            <span>${message}</span>
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Закрыть"></button>
        </div>
      `
      container.appendChild(toastEl)
      const toast = new bootstrap.Toast(toastEl, { delay: 5000 })
      toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove())
      toast.show()
    } else {
      alert(`${title}: ${message}`)
    }
  }

  function showSuccess(message, title = 'Готово') {
    return showModal({ title, message, type: 'success', confirmText: 'Понятно' })
  }

  function showModal(options = {}) {
    return new Promise((resolve) => {
      const {
        title = 'FastRent',
        message = '',
        confirmText = 'Ок',
        cancelText = 'Отмена',
        showCancel = false,
        type = 'info'
      } = options

      if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
        const modal = createModal()
        const modalTitleEl = modal.querySelector('.modal-title')
        const modalBodyEl = modal.querySelector('.modal-body')
        const confirmBtn = modal.querySelector('[data-role="confirm"]')
        const cancelBtn = modal.querySelector('[data-role="cancel"]')

        modalTitleEl.textContent = title
        modalBodyEl.innerHTML = `<p class="mb-0">${message}</p>`
        confirmBtn.textContent = confirmText
        
        if (type === 'success') {
          confirmBtn.className = 'btn btn-success'
        } else if (type === 'danger') {
          confirmBtn.className = 'btn btn-danger'
        } else if (type === 'warning') {
          confirmBtn.className = 'btn btn-warning'
        } else {
          confirmBtn.className = 'btn btn-primary'
        }
        
        if (showCancel) {
          cancelBtn.classList.remove('d-none')
          cancelBtn.textContent = cancelText
        } else {
          cancelBtn.classList.add('d-none')
        }

        if (!modalInstance) {
          modalInstance = new bootstrap.Modal(modal)
        }
        
        const onConfirm = () => {
          cleanup()
          modalInstance.hide()
          resolve(true)
        }
        const onCancel = () => {
          cleanup()
          modalInstance.hide()
          resolve(false)
        }
        
        function cleanup() {
          confirmBtn.removeEventListener('click', onConfirm)
          cancelBtn.removeEventListener('click', onCancel)
          modal.removeEventListener('hidden.bs.modal', onHidden)
        }
        
        const onHidden = () => {
          cleanup()
          resolve(false)
        }
        
        confirmBtn.addEventListener('click', onConfirm)
        if (showCancel) {
          cancelBtn.addEventListener('click', onCancel)
        }
        modal.addEventListener('hidden.bs.modal', onHidden)
        
        modalInstance.show()
      } else {
        alert(`${title}: ${message}`)
        resolve(true)
      }
    })
  }

  function confirm(options = {}) {
    return showModal({
      title: options.title || 'Подтверждение',
      message: options.message || '',
      confirmText: options.confirmText || 'Да',
      cancelText: options.cancelText || 'Отмена',
      showCancel: true,
      type: options.type || 'warning'
    })
  }

  function prompt(options = {}) {
    return new Promise((resolve) => {
      const {
        title = 'Сообщение',
        message = '',
        placeholder = 'Введите текст',
        defaultValue = '',
        confirmText = 'Отправить',
        cancelText = 'Отмена',
        type = 'info'
      } = options

      if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
        const modal = createModal()
        const modalTitleEl = modal.querySelector('.modal-title')
        const modalBodyEl = modal.querySelector('.modal-body')
        const confirmBtn = modal.querySelector('[data-role="confirm"]')
        const cancelBtn = modal.querySelector('[data-role="cancel"]')

        modalTitleEl.textContent = title
        modalBodyEl.innerHTML = `
          <label class="form-label">${message}</label>
          <textarea class="form-control" rows="4" placeholder="${placeholder}">${defaultValue}</textarea>
        `
        const input = modalBodyEl.querySelector('textarea')
        confirmBtn.textContent = confirmText
        cancelBtn.textContent = cancelText
        cancelBtn.classList.remove('d-none')
        
        if (type === 'success') {
          confirmBtn.className = 'btn btn-success'
        } else if (type === 'danger') {
          confirmBtn.className = 'btn btn-danger'
        } else if (type === 'warning') {
          confirmBtn.className = 'btn btn-warning'
        } else {
          confirmBtn.className = 'btn btn-primary'
        }

        if (!modalInstance) {
          modalInstance = new bootstrap.Modal(modal)
        }
        
        setTimeout(() => input.focus(), 150)
        
        const onConfirm = () => {
          const value = input.value.trim()
          cleanup()
          modalInstance.hide()
          resolve(value)
        }
        const onCancel = () => {
          cleanup()
          modalInstance.hide()
          resolve(null)
        }
        
        function cleanup() {
          confirmBtn.removeEventListener('click', onConfirm)
          cancelBtn.removeEventListener('click', onCancel)
          modal.removeEventListener('hidden.bs.modal', onHidden)
        }
        
        const onHidden = () => {
          cleanup()
          resolve(null)
        }
        
        confirmBtn.addEventListener('click', onConfirm)
        cancelBtn.addEventListener('click', onCancel)
        modal.addEventListener('hidden.bs.modal', onHidden)
        
        modalInstance.show()
      } else {
        const value = prompt(`${title}: ${message}`)
        resolve(value)
      }
    })
  }

  return {
    showError,
    showSuccess,
    showModal,
    confirm,
    prompt
  }
}
