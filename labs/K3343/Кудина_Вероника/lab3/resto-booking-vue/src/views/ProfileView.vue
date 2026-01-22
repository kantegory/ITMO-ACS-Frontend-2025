<template>
  <div class="container py-5">
    <h2 class="mb-4">Мой профиль</h2>
    
    <div class="row">
      <div class="col-md-4 mb-4">
        <div class="card">
          <div class="card-body">
            <h5><i class="bi bi-person-circle"></i> {{ user?.name }}</h5>
            <p class="text-muted mb-1"><i class="bi bi-envelope"></i> {{ user?.email }}</p>
            <p class="text-muted mb-3"><i class="bi bi-telephone"></i> {{ user?.phone }}</p>
            <button @click="logout" class="btn btn-outline-danger w-100">Выйти</button>
          </div>
        </div>
      </div>
      
      <div class="col-md-8">
        <h4 class="mb-3">Мои бронирования</h4>
        
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary"></div>
        </div>
        
        <div v-else-if="bookings.length === 0" class="alert alert-info">
          У вас пока нет бронирований
        </div>
        
        <div v-else>
          <div v-for="booking in bookings" :key="booking.id" class="card mb-3">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <h5>{{ booking.restaurantName }}</h5>
                  <p class="mb-1">
                    <i class="bi bi-calendar"></i> {{ booking.date }} в {{ booking.time }}
                  </p>
                  <p class="mb-1">
                    <i class="bi bi-people"></i> {{ booking.guests }} гостей
                  </p>
                  <p v-if="booking.comment" class="text-muted mb-0">
                    <small>{{ booking.comment }}</small>
                  </p>
                </div>
                <button @click="cancelBooking(booking.id)" class="btn btn-sm btn-danger">
                  Отменить
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useAuth } from '../composables/useAuth'
import { bookingService } from '../services/bookingService'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const { logout } = useAuth()

const bookings = ref([])
const loading = ref(true)

onMounted(async () => {
  if (user.value) {
    try {
      const response = await bookingService.getUserBookings(user.value.id)
      bookings.value = response.data
    } catch (error) {
      console.error('Ошибка загрузки бронирований:', error)
    } finally {
      loading.value = false
    }
  }
})

const cancelBooking = async (id) => {
  if (confirm('Отменить бронирование?')) {
    try {
      await bookingService.cancel(id)
      bookings.value = bookings.value.filter(b => b.id !== id)
      alert('Бронирование отменено')
    } catch (error) {
      alert('Ошибка при отмене')
    }
  }
}
</script>
