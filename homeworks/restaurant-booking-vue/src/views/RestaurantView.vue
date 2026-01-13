<template>
  <div class="container mt-4" v-if="restaurant">
    <h2>{{ restaurant.name }}</h2>
    <p>{{ restaurant.cuisine }} · {{ restaurant.location }} · {{ '₽'.repeat(restaurant.price) }}</p>
    <p>{{ restaurant.description }}</p>

    <h4>Меню</h4>
    <ul>
      <li v-for="item in restaurant.menu" :key="item">{{ item }}</li>
    </ul>

    <h4>Отзывы</h4>
    <ul>
      <li v-for="review in restaurant.reviews" :key="review">{{ review }}</li>
    </ul>

    <button class="btn btn-primary mt-3" @click="openBooking(restaurant)">Забронировать</button>

    <!-- Модалка бронирования -->
    <BookingModal
      :restaurant="selectedRestaurant"
      v-model="isBookingModalOpen"
    />
  </div>

  <div v-else class="container mt-4">
    <p>Загрузка...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '../api'
import BookingModal from '../components/BookingModal.vue'

const route = useRoute()
const restaurant = ref(null)
const selectedRestaurant = ref({})
const isBookingModalOpen = ref(false)

onMounted(async () => {
  const res = await api.getRestaurantById(route.params.id)
  restaurant.value = res.data
})

const openBooking = (r) => {
  selectedRestaurant.value = r
  isBookingModalOpen.value = true
}
</script>

<style scoped>
ul { list-style: disc; margin-left: 20px; }
</style>
