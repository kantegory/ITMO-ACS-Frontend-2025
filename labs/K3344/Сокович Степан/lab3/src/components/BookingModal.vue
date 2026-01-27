<template>
  <Teleport to="body">
    <div 
      v-if="show" 
      class="modal fade show modal-overlay" 
      style="display: block;" 
      tabindex="-1"
      @click.self="close"
    >
      <div class="modal-dialog modal-dialog-centered" @click.stop>
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Аренда помещения</h5>
            <button type="button" class="btn-close" @click="close" aria-label="Закрыть"></button>
          </div>
          <div class="modal-body">
            <div v-if="listing" class="mb-3">
              <h6>{{ listing.title }}</h6>
              <p class="text-muted">{{ listing.location }} · {{ formatPrice(listing.price) }} ₽ / мес</p>
            </div>
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="startDate" class="form-label">Дата начала аренды</label>
                <input 
                  id="startDate" 
                  v-model="bookingData.startDate" 
                  type="date" 
                  class="form-control" 
                  required
                  :min="minDate"
                >
              </div>
              <div class="mb-3">
                <label for="endDate" class="form-label">Дата окончания аренды</label>
                <input 
                  id="endDate" 
                  v-model="bookingData.endDate" 
                  type="date" 
                  class="form-control" 
                  required
                  :min="bookingData.startDate || minDate"
                >
              </div>
              <div v-if="error" class="alert alert-danger" role="alert">
                {{ error }}
              </div>
              <div class="d-flex justify-content-end gap-2">
                <button type="button" class="btn btn-secondary" @click="close">Отмена</button>
                <button type="submit" class="btn btn-primary" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  Подтвердить аренду
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  listing: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['close', 'submit'])

const bookingData = ref({
  startDate: '',
  endDate: ''
})

const minDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})

watch(() => props.show, (newVal) => {
  if (newVal) {
    bookingData.value = {
      startDate: '',
      endDate: ''
    }
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

const close = () => {
  emit('close')
}

const handleSubmit = () => {
  if (!bookingData.value.startDate || !bookingData.value.endDate) {
    return
  }
  emit('submit', {
    startDate: bookingData.value.startDate,
    endDate: bookingData.value.endDate
  })
}

const handleEscape = (e) => {
  if (e.key === 'Escape' && props.show) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  document.body.style.overflow = ''
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('ru-RU').format(price)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1050;
  background-color: rgba(0, 0, 0, 0.5);
  overflow-y: auto;
}

.modal-dialog {
  position: relative;
  width: auto;
  margin: 1.75rem auto;
  max-width: 500px;
  pointer-events: none;
}

.modal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  pointer-events: auto;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  outline: 0;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1rem;
  border-bottom: 1px solid #dee2e6;
  border-top-left-radius: calc(15px - 1px);
  border-top-right-radius: calc(15px - 1px);
}

.modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 1rem;
}

.btn-close {
  padding: 0.5rem 0.5rem;
  margin: -0.5rem -0.5rem -0.5rem auto;
}
</style>

