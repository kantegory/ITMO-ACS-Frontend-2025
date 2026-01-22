<template>
  <div class="container my-4">
    <h1 class="mb-3">Найдите ресторан</h1>

    <!-- Фильтры -->
    <form class="row g-2 align-items-end mb-3" @submit.prevent="applyFilters">
      <div class="col-md-4">
        <label class="form-label">Кухня</label>
        <select v-model="filters.cuisine" class="form-select">
          <option value="">Любая</option>
          <option v-for="c in cuisines" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
      <div class="col-md-3">
        <label class="form-label">Район / Город</label>
        <input v-model="filters.location" type="text" class="form-control" placeholder="Например, центр">
      </div>
      <div class="col-md-3">
        <label class="form-label">Цена</label>
        <select v-model="filters.price" class="form-select">
          <option value="">Любая</option>
          <option value="1">₽</option>
          <option value="2">₽₽</option>
          <option value="3">₽₽₽</option>
        </select>
      </div>
      <div class="col-md-2 d-grid">
        <button type="submit" class="btn btn-primary">Показать</button>
      </div>
    </form>

    <div v-if="loading" class="text-center my-3">Загрузка ресторанов...</div>
    <div v-if="error" class="text-danger">{{ error }}</div>

    <div class="row row-cols-1 row-cols-md-2 g-3">
      <div v-for="r in filteredRestaurants" :key="r.id" class="col">
        <RestaurantCard :restaurant="r" @open-booking="openBooking" />
      </div>
    </div>

    <BookingModal
      v-if="showModal"
      :restaurant="selectedRestaurant"
      @close="showModal = false"
      @booked="onBooked"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRestaurants } from '../composables/useRestaurants'
import { useBookings } from '../composables/useBookings'
import { currentUser } from '../composables/useAuth'
import RestaurantCard from '../components/RestaurantCard.vue'
import BookingModal from '../components/BookingModal.vue'

const { restaurants, cuisines, loading, error, fetchRestaurants } = useRestaurants()
const { createBooking } = useBookings()

const filters = ref({ cuisine: '', location: '', price: '' })

const filteredRestaurants = computed(() => {
  return restaurants.value.filter(r => {
    const matchesCuisine = filters.value.cuisine ? r.cuisine === filters.value.cuisine : true
    const matchesLocation = filters.value.location
      ? r.location.toLowerCase().includes(filters.value.location.toLowerCase())
      : true
    const matchesPrice = filters.value.price ? r.price <= Number(filters.value.price) : true
    return matchesCuisine && matchesLocation && matchesPrice
  })
})

const applyFilters = () => {}

const showModal = ref(false)
const selectedRestaurant = ref({})

const openBooking = (restaurant) => {
  if (!currentUser.value) return alert('Сначала войдите в аккаунт')
  selectedRestaurant.value = restaurant
  showModal.value = true
}

const onBooked = async ({ date, guests }) => {
  const booking = {
    email: currentUser.value.email,
    restaurantId: selectedRestaurant.value.id,
    name: selectedRestaurant.value.name,
    date,
    guests
  }
  const success = await createBooking(booking)
  if (success) {
    alert('Бронирование сохранено!')
    showModal.value = false
  } else {
    alert('Ошибка при бронировании')
  }
}

onMounted(fetchRestaurants)
</script>
