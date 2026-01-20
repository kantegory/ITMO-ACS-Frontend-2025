<template>
  <div
    class="modal fade"
    id="applicationModal"
    tabindex="-1"
    aria-hidden="true"
    ref="modalElement"
  >
    <div class="modal-dialog">
      <div class="modal-content glass-panel">
        <div class="modal-header border-0">
          <h5 class="modal-title" id="applicationModalTitle">Оставить отклик</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label class="form-label" for="applicantName">Имя и фамилия</label>
              <input
                type="text"
                class="form-control"
                id="applicantName"
                v-model="form.name"
                autocomplete="name"
                :readonly="!!user"
                required
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input 
                type="email" 
                class="form-control" 
                id="applicantEmail" 
                v-model="form.email" 
                :readonly="!!user"
                required 
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Сообщение</label>
              <textarea
                class="form-control"
                id="applicationMessage"
                rows="3"
                placeholder="Коротко о релевантном опыте"
                v-model="form.message"
                required
              ></textarea>
            </div>
            <button type="submit" class="btn btn-primary w-100">Отправить</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, ref, onMounted, computed } from 'vue'
import { Modal } from 'bootstrap'
import { useJobsStore } from '@/stores/jobs'

const props = defineProps({
  vacancy: { type: Object, default: null },
})

const emit = defineEmits(['submitted'])

const store = useJobsStore()
const modalElement = ref(null)
let modal = null

const user = computed(() => store.user)

const form = reactive({
  name: '',
  email: '',
  message: '',
})

onMounted(() => {
  if (modalElement.value) {
    modal = new Modal(modalElement.value)
  }
})

const show = () => {
  // Заполняем данные из профиля при открытии модального окна
  if (user.value) {
    form.name = user.value.fullName || user.value.name || ''
    form.email = user.value.email || ''
  }
  if (modal) {
    modal.show()
  }
}

defineExpose({ show })

watch(() => props.vacancy, (vacancy) => {
  if (vacancy && modal) {
    form.vacancy = vacancy.title || 'Свободная заявка'
  }
})

const handleSubmit = async () => {
  const vacancyTitle = props.vacancy?.title || 'Свободная заявка'
  const payload = {
    name: form.name,
    email: form.email,
    vacancy: vacancyTitle,
    title: vacancyTitle,
    candidate: form.name,
    message: form.message,
  }

  await store.createApplication(payload)
  
  form.name = ''
  form.email = ''
  form.message = ''
  
  if (modal) {
    modal.hide()
  }
  
  emit('submitted')
}
</script>
