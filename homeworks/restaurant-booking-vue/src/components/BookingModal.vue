<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal-content p-4 themed-modal">
      <h5><i class="fas fa-calendar-alt"></i> Бронирование: {{ restaurant.name }}</h5>
      <form @submit.prevent="submitBooking">
        <div class="mb-3">
          <label><i class="fas fa-clock"></i> Дата и время</label>
          <input type="datetime-local" v-model="date" class="form-control" required />
        </div>
        <div class="mb-3">
          <label><i class="fas fa-users"></i> Количество гостей</label>
          <input type="number" v-model.number="guests" min="1" class="form-control" required />
        </div>
        <div class="d-flex gap-2 mt-3">
          <button type="submit" class="btn btn-primary"><i class="fas fa-check"></i> Подтвердить</button>
          <button type="button" class="btn btn-secondary" @click="close"><i class="fas fa-times"></i> Отмена</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({ restaurant: Object })
const emit = defineEmits(['close', 'booked'])

const date = ref('')
const guests = ref(2)

function close() {
  emit('close')
}

function submitBooking() {
  emit('booked', { date: date.value, guests: guests.value })
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
  background: var(--bg-color, #fff);
  color: var(--text-color, #222);
  border-radius: 10px;
  max-width: 400px;
  width: 100%;
}
.themed-modal input {
  background-color: var(--bg-color, #fff);
  color: var(--text-color, #222);
}
</style>
