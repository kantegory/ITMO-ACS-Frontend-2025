<template>
  <div class="container py-5">
    <!-- Загрузка -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Загрузка...</span>
      </div>
    </div>

    <!-- Детали ресторана -->
    <div v-else-if="restaurant">
      <!-- Горизонтальное фото -->
      <div class="row mb-4">
        <div class="col-12">
          <img 
            :src="restaurant.image" 
            :alt="restaurant.name" 
            class="img-fluid rounded shadow-lg restaurant-hero-image"
          >
        </div>
      </div>

      <!-- Информация -->
      <div class="row">
        <div class="col-md-8">
          <h1 class="mb-3">{{ restaurant.name }}</h1>
          
          <div class="mb-3">
            <span class="badge bg-success me-2">{{ restaurant.cuisine }}</span>
            <span class="badge bg-primary me-2">{{ restaurant.price }}</span>
            <span class="badge bg-info">
              <i class="bi bi-geo-alt-fill me-1"></i>
              {{ restaurant.location }}
            </span>
          </div>

          <div class="mb-3">
            <span class="text-warning fs-5">
              <i class="bi bi-star-fill"></i> {{ restaurant.rating }}
            </span>
            <small class="text-muted ms-2">({{ restaurant.reviews }} отзывов)</small>
          </div>

          <p class="lead text-muted mb-4">{{ restaurant.description }}</p>
        </div>

        <!-- Кнопка бронирования -->
        <div class="col-md-4">
          <div class="card shadow-sm sticky-top" style="top: 100px;">
            <div class="card-body">
              <h5 class="card-title mb-3">Забронировать столик</h5>
              <button 
                v-if="isAuthenticated"
                @click="openBookingModal" 
                class="btn btn-primary btn-lg w-100"
              >
                <i class="bi bi-calendar-check me-2"></i>
                Забронировать
              </button>
              <router-link 
                v-else
                to="/login" 
                class="btn btn-primary btn-lg w-100"
              >
                <i class="bi bi-box-arrow-in-right me-2"></i>
                Войдите для бронирования
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Меню ресторана -->
      <div v-if="restaurant.menu" class="mt-5">
        <h2 class="mb-4">
          <i class="bi bi-card-list me-2"></i>
          Меню ресторана
        </h2>
        <div class="row">
          <div v-for="item in restaurant.menu" :key="item.name" class="col-md-4 mb-4">
            <MenuItem :item="item" />
          </div>
        </div>
      </div>
    </div>

    <!-- Ошибка -->
    <div v-else-if="!loading && !restaurant" class="text-center py-5">
      <i class="bi bi-exclamation-triangle display-1 text-danger"></i>
      <h3 class="mt-3">Ресторан не найден</h3>
      <router-link to="/restaurants" class="btn btn-primary mt-3">
        <i class="bi bi-arrow-left me-2"></i>
        Вернуться к списку
      </router-link>
    </div>

    <!-- Модалка бронирования -->
    <BookingModal
      v-if="restaurant && isAuthenticated"
      :restaurant="restaurant"
      :userId="user.id"
      modalId="bookingModal"
      @booking-created="handleBookingCreated"
      ref="bookingModalRef"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { restaurantService } from '../services/restaurantService'
import { bookingService } from '../services/bookingService'
import { useAuthStore } from '../stores/auth'
import { storeToRefs } from 'pinia'
import BookingModal from '../components/BookingModal.vue'
import MenuItem from '../components/MenuItem.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const restaurant = ref(null)
const loading = ref(true)
const bookingModalRef = ref(null)

const isAuthenticated = computed(() => !!user.value)

// ✅ ИСПРАВЛЕННЫЙ МЕТОД ОТКРЫТИЯ МОДАЛКИ
const openBookingModal = () => {
  console.log('🔵 Клик по кнопке "Забронировать"')
  console.log('bookingModalRef.value:', bookingModalRef.value)
  
  if (!bookingModalRef.value) {
    console.error('❌ bookingModalRef не существует!')
    return
  }
  
  // Вызываем метод show() из defineExpose
  if (typeof bookingModalRef.value.show === 'function') {
    console.log('✅ Вызываем show()')
    bookingModalRef.value.show()
  } else {
    console.error('❌ Метод show() не найден!')
    console.log('Доступные методы:', Object.keys(bookingModalRef.value))
  }
}

const handleBookingCreated = async (bookingData) => {
  console.log('📝 Получены данные бронирования:', bookingData)
  
  try {
    const response = await bookingService.create(bookingData)
    console.log('✅ Бронирование создано:', response.data)
    
    setTimeout(() => {
      router.push('/profile')
    }, 1500)
    
  } catch (error) {
    console.error('❌ Ошибка создания бронирования:', error)
    alert('Не удалось создать бронирование')
  }
}

onMounted(async () => {
  try {
    const id = route.params.id
    console.log('🔍 Загружаем ресторан ID:', id)
    
    const response = await restaurantService.getById(id)
    restaurant.value = response.data
    
    console.log('✅ Ресторан загружен:', restaurant.value)
  } catch (error) {
    console.error('❌ Ошибка загрузки ресторана:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.restaurant-hero-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 16px;
}

.card {
  border: none;
  border-radius: 12px;
}

.badge {
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
}

.btn-primary {
  border-radius: 8px;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
}

.lead {
  font-size: 1.1rem;
  line-height: 1.6;
}

h1 {
  font-weight: 700;
}

h2 {
  font-weight: 600;
}
</style>