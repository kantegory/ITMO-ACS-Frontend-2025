(function(global){
  const FastRent = global.FastRent = global.FastRent || {};
  let modalEl = null;
  let modalInstance = null;
  let modalTitleEl = null;
  let modalBodyEl = null;
  let confirmBtn = null;
  let cancelBtn = null;
  let toastContainer = null;

  function ensureBootstrap(feature) {
    if (typeof bootstrap === 'undefined') {
      console.error(`Bootstrap ${feature} недоступен. Подключите bootstrap.bundle.`);
      return null;
    }
    return bootstrap;
  }

  function ensureModal() {
    if (modalEl) return modalEl;
    modalEl = document.createElement('div');
    modalEl.className = 'modal fade';
    modalEl.id = 'frDialogModal';
    modalEl.tabIndex = -1;
    modalEl.setAttribute('aria-hidden', 'true');
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
      </div>`;
    document.body.appendChild(modalEl);
    const bs = ensureBootstrap('Modal');
    if (!bs || !bs.Modal) return null;
    modalInstance = new bs.Modal(modalEl);
    modalTitleEl = modalEl.querySelector('.modal-title');
    modalBodyEl = modalEl.querySelector('.modal-body');
    confirmBtn = modalEl.querySelector('[data-role="confirm"]');
    cancelBtn = modalEl.querySelector('[data-role="cancel"]');
    return modalEl;
  }

  function ensureToastContainer() {
    if (toastContainer) return toastContainer;
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
    toastContainer.style.zIndex = '1080';
    toastContainer.setAttribute('aria-live', 'polite');
    toastContainer.setAttribute('aria-atomic', 'true');
    document.body.appendChild(toastContainer);
    return toastContainer;
  }

  function applyType(type) {
    if (!confirmBtn || !modalTitleEl) return;
    const btnClasses = ['btn-primary', 'btn-success', 'btn-danger', 'btn-warning'];
    confirmBtn.classList.remove(...btnClasses);
    modalTitleEl.classList.remove('text-success', 'text-danger', 'text-warning');
    if (type === 'success') {
      confirmBtn.classList.add('btn-success');
      modalTitleEl.classList.add('text-success');
    } else if (type === 'danger') {
      confirmBtn.classList.add('btn-danger');
      modalTitleEl.classList.add('text-danger');
    } else if (type === 'warning') {
      confirmBtn.classList.add('btn-warning');
      modalTitleEl.classList.add('text-warning');
    } else {
      confirmBtn.classList.add('btn-primary');
    }
  }

  function showModal(options = {}) {
    if (!ensureModal() || !modalInstance) return Promise.resolve(false);
    const {
      title = 'FastRent',
      message = '',
      html = '',
      confirmText = 'Ок',
      cancelText = 'Отмена',
      showCancel = false,
      type = 'info'
    } = options;
    modalTitleEl.textContent = title;
    if (html) {
      modalBodyEl.innerHTML = html;
    } else {
      modalBodyEl.innerHTML = `<p class="mb-0">${message}</p>`;
    }
    confirmBtn.textContent = confirmText;
    if (showCancel) {
      cancelBtn.classList.remove('d-none');
      cancelBtn.textContent = cancelText;
    } else {
      cancelBtn.classList.add('d-none');
    }
    applyType(type);
    return new Promise((resolve) => {
      const onConfirm = () => {
        cleanup();
        modalInstance.hide();
        resolve(true);
      };
      const onCancel = () => {
        cleanup();
        modalInstance.hide();
        resolve(false);
      };
      const onHidden = () => {
        cleanup();
        resolve(false);
      };
      function cleanup() {
        confirmBtn.removeEventListener('click', onConfirm);
        cancelBtn.removeEventListener('click', onCancel);
        modalEl.removeEventListener('hidden.bs.modal', onHidden);
      }
      confirmBtn.addEventListener('click', onConfirm);
      if (showCancel) {
        cancelBtn.addEventListener('click', onCancel);
      }
      modalEl.addEventListener('hidden.bs.modal', onHidden);
      modalInstance.show();
    });
  }

  function confirm(options = {}) {
    return showModal({
      title: options.title || 'Подтверждение',
      message: options.message || '',
      confirmText: options.confirmText || 'Да',
      cancelText: options.cancelText || 'Отмена',
      showCancel: true,
      type: options.type || 'warning'
    });
  }

  function prompt(options = {}) {
    if (!ensureModal() || !modalInstance) return Promise.resolve(null);
    const {
      title = 'Сообщение',
      message = '',
      placeholder = 'Введите текст',
      defaultValue = '',
      confirmText = 'Отправить',
      cancelText = 'Отмена',
      type = 'info'
    } = options;
    modalTitleEl.textContent = title;
    modalBodyEl.innerHTML = `
      <label class="form-label">${message}</label>
      <textarea class="form-control" rows="4" placeholder="${placeholder}">${defaultValue}</textarea>`;
    const input = modalBodyEl.querySelector('textarea');
    confirmBtn.textContent = confirmText;
    cancelBtn.textContent = cancelText;
    cancelBtn.classList.remove('d-none');
    applyType(type);
    setTimeout(() => input.focus(), 150);
    return new Promise((resolve) => {
      const onConfirm = () => {
        const value = input.value.trim();
        cleanup();
        modalInstance.hide();
        resolve(value);
      };
      const onCancel = () => {
        cleanup();
        modalInstance.hide();
        resolve(null);
      };
      const onHidden = () => {
        cleanup();
        resolve(null);
      };
      function cleanup() {
        confirmBtn.removeEventListener('click', onConfirm);
        cancelBtn.removeEventListener('click', onCancel);
        modalEl.removeEventListener('hidden.bs.modal', onHidden);
      }
      confirmBtn.addEventListener('click', onConfirm);
      cancelBtn.addEventListener('click', onCancel);
      modalEl.addEventListener('hidden.bs.modal', onHidden);
      modalInstance.show();
    });
  }

  function showToast(options = {}) {
    const container = ensureToastContainer();
    if (!container) return;
    const {
      title = 'Уведомление',
      message = '',
      variant = 'danger',
      delay = 5000
    } = options;
    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center text-bg-${variant} border-0 shadow`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');
    toastEl.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          <strong class="d-block">${title}</strong>
          <span>${message}</span>
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Закрыть"></button>
      </div>`;
    container.appendChild(toastEl);
    const bs = ensureBootstrap('Toast');
    if (!bs || !bs.Toast) return;
    const toast = new bs.Toast(toastEl, { delay });
    toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
    toast.show();
  }

  function showError(message, title = 'Ошибка') {
    showToast({ message, title, variant: 'danger' });
  }

  function showSuccess(message, title = 'Готово') {
    return showModal({ title, message, type: 'success', confirmText: 'Понятно' });
  }

  FastRent.notifications = {
    showModal,
    showSuccess,
    showError,
    confirm,
    prompt,
    showToast
  };
})(window);
