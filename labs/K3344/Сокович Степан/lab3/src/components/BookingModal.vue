<template>
  <div 
    v-if="show" 
    class="modal fade show" 
    style="display: block;" 
    tabindex="-1"
    @click.self="close"
  >
    <div class="modal-dialog modal-dialog-centered">
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
    <div class="modal-backdrop fade show" @click="close"></div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

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

const formatPrice = (price) => {
  return new Intl.NumberFormat('ru-RU').format(price)
}
</script>

<style scoped>
.modal-content {
  border-radius: 15px;
  padding: 20px;
}
</style>

