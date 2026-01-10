<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-3">
      <label for="rentStartDate" class="form-label">Дата начала аренды</label>
      <input 
        type="date" 
        class="form-control" 
        id="rentStartDate" 
        v-model="startDate"
        required 
        aria-required="true"
        @change="calculateTotal"
      >
    </div>
    <div class="mb-3">
      <label for="rentEndDate" class="form-label">Дата окончания аренды</label>
      <input 
        type="date" 
        class="form-control" 
        id="rentEndDate" 
        v-model="endDate"
        required 
        aria-required="true"
        @change="calculateTotal"
      >
    </div>
    <div class="mb-3">
      <label for="rentGuests" class="form-label">Количество гостей</label>
      <input 
        type="number" 
        class="form-control" 
        id="rentGuests" 
        v-model.number="guests"
        min="1" 
        required 
        aria-required="true"
      >
    </div>
    <div class="alert alert-info" role="status" aria-live="polite">
      <strong>Сумма к оплате:</strong> {{ totalAmount.toLocaleString('ru-RU') }} ₽
    </div>
    <div v-if="error" class="alert alert-danger" role="alert" aria-live="assertive">
      {{ error }}
    </div>
    <div class="d-flex gap-2">
      <button type="button" class="btn btn-secondary flex-fill" @click="$emit('cancel')">
        Отмена
      </button>
      <button type="submit" class="btn btn-primary flex-fill" :disabled="loading">
        {{ loading ? 'Оформление...' : 'Оформить' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { validateDateRange, validateDateNotPast } from '@/utils/validators'

const props = defineProps({
  price: {
    type: Number,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

const startDate = ref('')
const endDate = ref('')
const guests = ref(1)
const error = ref('')

const totalAmount = computed(() => {
  if (!startDate.value || !endDate.value) return 0
  
  const start = new Date(startDate.value)
  const end = new Date(endDate.value)
  
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
    return 0
  }
  
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
  const months = Math.ceil(days / 30)
  return props.price * months
})

const calculateTotal = () => {
  // Метод вызывается при изменении дат
}

const handleSubmit = () => {
  error.value = ''

  // Валидация
  if (!startDate.value || !endDate.value) {
    error.value = 'Заполните все поля формы'
    return
  }

  if (!validateDateNotPast(startDate.value)) {
    error.value = 'Дата начала аренды не может быть в прошлом'
    return
  }

  if (!validateDateRange(startDate.value, endDate.value)) {
    error.value = 'Дата окончания должна быть позже даты начала'
    return
  }

  if (!guests.value || guests.value < 1) {
    error.value = 'Количество гостей должно быть не менее 1'
    return
  }

  emit('submit', {
    startDate: startDate.value,
    endDate: endDate.value,
    guests: guests.value
  })
}
</script>
