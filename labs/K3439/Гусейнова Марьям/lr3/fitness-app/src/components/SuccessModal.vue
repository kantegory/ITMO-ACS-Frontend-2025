<template>
  <div class="modal fade" id="successModal" tabindex="-1" aria-labelledby="successModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header" :class="modalHeaderClass">
          <h5 class="modal-title" id="successModalLabel">{{ title }}</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Закрыть"></button>
        </div>
        <div class="modal-body">
          <svg class="icon fs-3 me-2" :class="iconClass" aria-hidden="true">
            <use :href="`/icons.svg#${icon}`"></use>
          </svg>
          <span>{{ message }}</span>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn" :class="buttonClass" data-bs-dismiss="modal">Ок</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'SuccessModal',
  setup() {
    const modal = ref(null)
    const isError = ref(false)
    const title = ref('Успех!')
    const message = ref('')
    const redirectRoute = ref(null)
    const router = useRouter()

    onMounted(() => {
      const modalElement = document.getElementById('successModal')
      modal.value = new Modal(modalElement)
      
      modalElement.addEventListener('hidden.bs.modal', () => {
        if (redirectRoute.value) {
          router.push(redirectRoute.value)
          redirectRoute.value = null
        }
        resetModal()
      })
    })

    const modalHeaderClass = computed(() => {
      return isError.value ? 'bg-danger text-white' : 'bg-success text-white'
    })

    const buttonClass = computed(() => {
      return isError.value ? 'btn-danger' : 'btn-success'
    })

    const iconClass = computed(() => {
      return isError.value ? 'text-danger' : 'text-success'
    })

    const icon = computed(() => {
      return isError.value ? 'icon-x-circle-fill' : 'icon-check-circle-fill'
    })

    const showSuccess = (msg, route = null) => {
      isError.value = false
      title.value = 'Успех!'
      message.value = msg
      redirectRoute.value = route
      modal.value.show()
    }

    const showError = (errorTitle, errorMessage) => {
      isError.value = true
      title.value = errorTitle
      message.value = errorMessage
      modal.value.show()
    }

    const resetModal = () => {
      isError.value = false
      title.value = 'Успех!'
      message.value = ''
    }

    return {
      title,
      message,
      modalHeaderClass,
      buttonClass,
      iconClass,
      icon,
      showSuccess,
      showError
    }
  }
}
</script>