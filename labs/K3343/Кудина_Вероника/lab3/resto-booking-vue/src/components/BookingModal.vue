<template>
  <div class="modal fade" :id="modalId" tabindex="-1" ref="modalElement">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="bi bi-calendar-check me-2"></i>
            Забронировать столик в {{ restaurant?.name }}
          </h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        
        <div class="modal-body">
          <div v-if="bookingSuccess" class="alert alert-success">
            <i class="bi bi-check-circle me-2"></i>
            Бронирование успешно создано!
          </div>

          <div v-if="bookingError" class="alert alert-danger">
            <i class="bi bi-exclamation-triangle me-2"></i>
            {{ bookingError }}
          </div>

          <form @submit.prevent="handleSubmit">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Дата</label>
                <input 
                  v-model="form.date" 
                  type="date" 
                  class="form-control" 
                  :min="minDate"
                  required
                >
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Время</label>
                <select v-model="form.time" class="form-select" required>
                  <option value="">Выберите время</option>
                  <option v-for="time in availableTimes" :key="time" :value="time">
                    {{ time }}
                  </option>
                </select>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Количество гостей</label>
              <select v-model.number="form.guests" class="form-select" required>
                <option value="">Выберите количество</option>
                <option v-for="n in 8" :key="n" :value="n">
                  {{ n }} {{ getGuestsText(n) }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Комментарий (необязательно)</label>
              <textarea 
                v-model="form.comment" 
                class="form-control" 
                rows="3"
                placeholder="Особые пожелания..."
              ></textarea>
            </div>

            <button 
              type="submit" 
              class="btn btn-primary w-100" 
              :disabled="submitting"
            >
              <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="bi bi-calendar-check me-2"></i>
              Забронировать
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useModal } from '@/composables/useModal'

const { cleanupModal } = useModal()

const props = defineProps({
  restaurant: {
    type: Object,
    required: true
  },
  userId: {
    type: Number,
    required: true
  },
  modalId: {
    type: String,
    default: 'bookingModal'
  }
})

const emit = defineEmits(['booking-created'])

const modalElement = ref(null)
let modalInstance = null

const form = ref({
  date: '',
  time: '',
  guests: '',
  comment: ''
})

const submitting = ref(false)
const bookingSuccess = ref(false)
const bookingError = ref(null)

const minDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const availableTimes = [
  '12:00', '13:00', '14:00', '15:00', 
  '18:00', '19:00', '20:00', '21:00'
]

const getGuestsText = (count) => {
  if (count === 1) return 'гость'
  if (count >= 2 && count <= 4) return 'гостя'
  return 'гостей'
}

onMounted(async () => {
  await nextTick()
  
  if (!window.bootstrap || !modalElement.value) return
  
  try {
    modalInstance = new window.bootstrap.Modal(modalElement.value, {
      backdrop: 'static',
      keyboard: false
    })
  } catch (error) {
    console.error('Modal initialization error:', error)
  }
})

onUnmounted(() => {
  if (modalInstance) {
    modalInstance.dispose()
  }
  cleanupModal()
})

const handleSubmit = async () => {
  try {
    submitting.value = true
    bookingError.value = null
    bookingSuccess.value = false

    if (!form.value.date || !form.value.time || !form.value.guests) {
      bookingError.value = 'Заполните все обязательные поля'
      submitting.value = false
      return
    }

    const bookingData = {
      userId: props.userId,
      restaurantId: props.restaurant.id,
      restaurantName: props.restaurant.name,
      date: form.value.date,
      time: form.value.time,
      guests: form.value.guests,
      comment: form.value.comment
    }

    emit('booking-created', bookingData)
    bookingSuccess.value = true
    
    setTimeout(() => {
      closeModal()
      resetForm()
      cleanupModal()
    }, 1500)

  } catch (error) {
    bookingError.value = 'Ошибка при создании бронирования. Попробуйте снова.'
  } finally {
    submitting.value = false
  }
}

const closeModal = () => {
  if (modalInstance) {
    modalInstance.hide()
  }
  cleanupModal()
}

const resetForm = () => {
  form.value = {
    date: '',
    time: '',
    guests: '',
    comment: ''
  }
  bookingSuccess.value = false
  bookingError.value = null
}

const forceShow = () => {
  if (!modalInstance && modalElement.value && window.bootstrap) {
    try {
      modalInstance = new window.bootstrap.Modal(modalElement.value, {
        backdrop: 'static',
        keyboard: false
      })
    } catch (error) {
      console.error('Modal creation error:', error)
      return
    }
  }
  
  if (modalInstance) {
    modalInstance.show()
  }
}

defineExpose({ 
  show: forceShow,
  hide: closeModal,
  modalInstance
})
</script>

<style scoped>
.modal-content {
  border: none;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
}

.modal-header {
  border-bottom: 1px solid #e5e7eb;
  padding: 1.5rem;
}

.modal-body {
  padding: 1.5rem;
}

.form-label {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.alert {
  border-radius: 8px;
}
</style>
