<template>
  <div class="modal fade" ref="modalRef">
    <div class="modal-dialog">
      <div class="modal-content">
        <form @submit.prevent="submit" novalidate>
          <div class="modal-header">
            <h5 class="modal-title">Добавить новый пост</h5>
            <button class="btn-close" type="button" data-bs-dismiss="modal" />
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Заголовок</label>
              <input v-model="form.title" class="form-control" required />
            </div>

            <div class="mb-3">
              <label class="form-label">Текст</label>
              <textarea v-model="form.text" class="form-control" rows="4" required />
            </div>

            <div class="mb-3">
              <label class="form-label">Изображение</label>
              <input v-model="form.image" type="url" class="form-control" />
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-primary">Добавить</button>
            <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">
              Закрыть
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Modal } from 'bootstrap'

const emit = defineEmits(['submit'])

const modalRef = ref(null)
let modal

const form = ref({
  title: '',
  text: '',
  image: ''
})

onMounted(() => {
  modal = new Modal(modalRef.value)
})

const submit = () => {
  emit('submit', {
    ...form.value,
    image: form.value.image || 'https://picsum.photos/seed/new/600/400'
  })

  form.value = { title: '', text: '', image: '' }
  modal.hide()
}

defineExpose({ open: () => modal.show() })
</script>
