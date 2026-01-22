<template>
  <div v-if="restaurant" class="container mt-4">
    <button class="btn btn-outline-secondary mb-3" @click="goBack">
      ← Назад
    </button>

    <h2>{{ restaurant.name }}</h2>

    <!-- Картинка ресторана -->
    <img
      v-if="restaurant.img"
      :src="getImgPath(restaurant.img)"
      class="restaurant-img mb-3"
      :alt="restaurant.name"
    />

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

    <button class="btn btn-primary mt-3" @click="showBookingModal = true">
      Забронировать
    </button>

    <BookingModal
      v-if="showBookingModal"
      :restaurant="restaurant"
      @close="showBookingModal = false"
      @booked="onBooked"
    />
  </div>

  <div v-else class="container mt-4">
    <p>Загрузка...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRestaurants } from '../composables/useRestaurants'
import { useBookings } from '../composables/useBookings'
import BookingModal from '../components/BookingModal.vue'

const route = useRoute()
const router = useRouter()
const { getRestaurantById } = useRestaurants()
const { createBooking } = useBookings()

const restaurant = ref(null)
const showBookingModal = ref(false)

// ------------------- Загрузка ресторана -------------------
onMounted(async () => {
  restaurant.value = await getRestaurantById(route.params.id)
})

// ------------------- Обработка бронирования -------------------
const onBooked = async ({ date, guests }) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'))
  if (!currentUser) return alert('Сначала войдите в аккаунт')

  const success = await createBooking({
    email: currentUser.email,
    restaurantId: restaurant.value.id,
    name: restaurant.value.name,
    date,
    guests
  })

  if (success) {
    alert('Бронирование сохранено!')
    showBookingModal.value = false
  } else {
    alert('Ошибка при бронировании')
  }
}

// ------------------- Кнопка назад -------------------
function goBack() {
  router.back()
}

// ------------------- Корректный путь к картинке -------------------
function getImgPath(path) {
  if (path.startsWith('http') || path.startsWith('/')) return path
  return import.meta.env.BASE_URL + path
}
</script>

<style scoped>
.restaurant-img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 1rem;
}
</style>
