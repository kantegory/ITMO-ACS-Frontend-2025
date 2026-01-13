<template>
  <div v-if="visible" class="modal-backdrop" @click.self="close">
    <div class="modal-content p-4">
      <h5>Бронирование: {{ restaurant.name }}</h5>
      <form @submit.prevent="submitBooking">
        <div class="mb-3">
          <label>Имя</label>
          <input type="text" v-model="guestName" class="form-control" required />
        </div>
        <div class="mb-3">
          <label>Дата и время</label>
          <input type="datetime-local" v-model="date" class="form-control" required />
        </div>
        <div class="mb-3">
          <label>Количество гостей</label>
          <input type="number" v-model.number="guests" min="1" class="form-control" required />
        </div>
        <div class="d-flex gap-2">
          <button type="submit" class="btn btn-primary">Подтвердить</button>
          <button type="button" class="btn btn-secondary" @click="close">Отмена</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { api } from '../api'

const props = defineProps({
  restaurant: Object,
  modelValue: Boolean
})
const emit = defineEmits(['update:modelValue'])

const visible = ref(false)
const guestName = ref('')
const date = ref('')
const guests = ref(2)

// Слушаем props.modelValue
watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) {
    guestName.value = ''
    date.value = ''
    guests.value = 2
  }
})

function close() {
  emit('update:modelValue', false)
}

async function submitBooking() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'))
  if (!currentUser) return alert('Сначала войдите в аккаунт')

  const booking = {
    email: currentUser.email,
    restaurantId: props.restaurant.id,
    name: props.restaurant.name,
    date: date.value,
    guests: guests.value
  }

  await api.createBooking(booking)
  alert('Бронирование сохранено!')
  close()
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top:0; left:0; right:0; bottom:0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.modal-content {
  background: white;
  border-radius: 6px;
  max-width: 400px;
  width: 100%;
}
</style>
