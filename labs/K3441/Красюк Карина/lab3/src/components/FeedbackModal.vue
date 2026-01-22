<template>
  <div
    class="modal fade show"
    :class="{ show: true }"
    style="display: block;"
    tabindex="-1"
    role="dialog"
    aria-labelledby="feedbackModalLabel"
    aria-modal="true"
    @click.self="$emit('close')"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="feedbackModalLabel">Обратная связь</h5>
          <button type="button" class="btn-close" @click="$emit('close')" aria-label="Закрыть окно обратной связи">
            <span class="icon" style="width: 1rem; height: 1rem;">
              <svg><use href="#icon-close"></use></svg>
            </span>
          </button>
        </div>
        <div class="modal-body">
          <p id="feedbackModalDescription" class="visually-hidden">Форма для отправки обратной связи о работе сервиса</p>
          <form @submit.prevent="handleSubmit" aria-label="Форма обратной связи">
            <div class="mb-3">
              <label for="feedbackEmail" class="form-label">Ваш e-mail</label>
              <input
                type="email"
                id="feedbackEmail"
                v-model="form.email"
                class="form-control"
                required
                aria-required="true"
                aria-describedby="feedbackEmail-error"
              >
              <div class="invalid-feedback" id="feedbackEmail-error">Введите корректный e-mail адрес</div>
            </div>
            <div class="mb-3">
              <label for="feedbackMessage" class="form-label">Сообщение</label>
              <textarea
                id="feedbackMessage"
                v-model="form.message"
                class="form-control"
                rows="4"
                required
                aria-required="true"
                aria-describedby="feedbackMessage-error"
              ></textarea>
              <div class="invalid-feedback" id="feedbackMessage-error">Введите текст сообщения</div>
            </div>
            <button type="submit" class="btn btn-primary">Отправить</button>
          </form>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" @click="$emit('close')"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useNotifications } from '@/composables/useNotifications'

const emit = defineEmits(['close'])
const { success } = useNotifications()

const form = ref({
  email: '',
  message: ''
})

const handleSubmit = () => {
  success('Спасибо за обратную связь! Мы свяжемся с вами в ближайшее время.')
  emit('close')
  form.value = { email: '', message: '' }
}
</script>

<style scoped>
.modal.show {
  display: block;
}
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1040;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  opacity: 0.5;
}
</style>

