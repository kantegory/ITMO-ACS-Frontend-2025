<template>
  <main class="container mt-5">
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Загрузка...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <div v-else-if="restaurant">
      <h2>{{ restaurant.name }}</h2>
      <router-link to="/" class="btn btn-secondary mb-4">← На главную</router-link>

      <!-- Carousel -->
      <div id="restaurantCarousel" class="carousel slide mb-4" data-bs-ride="carousel">
        <div class="carousel-inner">
          <div 
            v-for="(image, index) in restaurant.images" 
            :key="index"
            :class="['carousel-item', { active: index === 0 }]"
          >
            <img 
              :src="getImageUrl(image)" 
              class="d-block w-100" 
              :alt="restaurant.name"
              style="height: 400px; object-fit: cover;"
            >
          </div>
        </div>
        <button 
          class="carousel-control-prev" 
          type="button" 
          data-bs-target="#restaurantCarousel" 
          data-bs-slide="prev"
        >
          <span class="carousel-control-prev-icon"></span>
        </button>
        <button 
          class="carousel-control-next" 
          type="button" 
          data-bs-target="#restaurantCarousel" 
          data-bs-slide="next"
        >
          <span class="carousel-control-next-icon"></span>
        </button>
      </div>

      <!-- Menu -->
      <section class="mb-4">
        <h3>Меню</h3>
        <ul class="list-group">
          <li 
            v-for="(item, index) in restaurant.menu" 
            :key="index"
            class="list-group-item"
          >
            {{ item }}
          </li>
        </ul>
      </section>

      <!-- Reviews -->
      <section class="mb-4">
        <h3>Отзывы</h3>
        <div 
          v-for="(review, index) in restaurant.reviews" 
          :key="index"
          class="card mb-2"
        >
          <div class="card-body">
            <h5>{{ review.name }}</h5>
            <p>{{ review.text }}</p>
          </div>
        </div>
      </section>

      <button class="btn btn-success" @click="handleBookingClick">
        Забронировать столик
      </button>

      <BookingModal 
        ref="bookingModal"
        :restaurant-id="restaurant.id"
        :restaurant-name="restaurant.name"
        @booking-success="handleBookingSuccess"
      />
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BookingModal from '@/components/BookingModal.vue'
import { useRestaurants } from '@/composables/useRestaurants'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'
import type { Restaurant } from '@/types'

const route = useRoute()
const router = useRouter()
const { isAuthenticated } = useAuth()
const { showToast } = useToast()
const { fetchRestaurantById, loading, error } = useRestaurants()

const restaurant = ref<Restaurant | null>(null)
const bookingModal = ref<InstanceType<typeof BookingModal>>()

onMounted(async () => {
  const id = route.params.id as string
  restaurant.value = await fetchRestaurantById(id)
})

const getImageUrl = (path: string) => {
  const cleanPath = path.replace(/^assets\//, '')
  return new URL(`../assets/${cleanPath}`, import.meta.url).href
}

const handleBookingClick = () => {
  if (!isAuthenticated.value) {
    showToast('Сначала войдите в систему!', 'danger')
    return
  }
  bookingModal.value?.show()
}

const handleBookingSuccess = () => {
  router.push('/profile')
}
</script>

