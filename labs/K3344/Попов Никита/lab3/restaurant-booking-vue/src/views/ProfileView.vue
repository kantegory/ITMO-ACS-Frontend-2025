<template>
  <main class="container mt-5">
    <router-link to="/" class="btn btn-secondary mb-3">← На главную</router-link>
    
    <h2>Личный кабинет</h2>
    
    <div v-if="currentUser" class="mb-4">
      <p><b>Логин:</b> {{ currentUser.username }}</p>
      <p><b>Email:</b> {{ currentUser.email }}</p>
    </div>

    <h3>История бронирований</h3>

    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Загрузка...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <ul v-else class="list-group">
      <li v-if="bookings.length === 0" class="list-group-item">
        Нет бронирований
      </li>
      <li 
        v-for="booking in bookings" 
        :key="booking.id"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <div>
          <strong>{{ booking.restaurantName }}</strong>
          <br>
          {{ formatDate(booking.date) }} {{ booking.time }}
        </div>
        <button 
          class="btn btn-sm btn-danger" 
          @click="handleDeleteBooking(booking.id!)"
        >
          Удалить
        </button>
      </li>
    </ul>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useBookings } from '@/composables/useBookings'
import { useToast } from '@/composables/useToast'
import { useRouter } from 'vue-router'
import { formatDate } from '@/utils/dateFormat'

const { currentUser } = useAuth()
const { bookings, loading, error, fetchBookingsByUserId, deleteBooking } = useBookings()
const { showToast } = useToast()
const router = useRouter()

onMounted(async () => {
  if (!currentUser.value) {
    showToast('Сначала войдите!', 'danger')
    router.push('/')
    return
  }
  
  await fetchBookingsByUserId(currentUser.value.id)
})

const handleDeleteBooking = async (id: number) => {
  try {
    await deleteBooking(id)
    showToast('Бронирование отменено', 'success')
  } catch (error) {
    showToast('Ошибка отмены бронирования', 'danger')
  }
}
</script>

