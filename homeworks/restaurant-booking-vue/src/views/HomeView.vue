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
        <input v-model="filters.location" type="text" class="form-control" placeholder="Например, Центр">
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

    <hr>

    <!-- Список ресторанов -->
    <div class="row row-cols-1 row-cols-md-2 g-3">
      <div v-for="r in filteredRestaurants" :key="r.id" class="col">
        <div class="card h-100 themed-btn">
          <img :src="r.img" class="card-img-top" :alt="r.name">
          <div class="card-body">
            <h3 class="card-title">{{ r.name }}</h3>
            <p class="card-text text-muted">{{ r.cuisine }} · {{ r.location }} · {{ '₽'.repeat(r.price) }}</p>
            <div class="d-flex gap-2">
              <router-link :to="`/restaurant/${r.id}`" class="btn btn-outline-secondary">Подробнее</router-link>
              <button class="btn btn-primary" @click="openBooking(r)">Забронировать</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модалка бронирования -->
    <BookingModal
      :restaurant="selectedRestaurant"
      v-model="isBookingModalOpen"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { api } from '../api'
import BookingModal from '../components/BookingModal.vue'

const restaurants = ref([])
const filters = ref({ cuisine: '', location: '', price: '' })
const cuisines = ref([])
const selectedRestaurant = ref({})
const isBookingModalOpen = ref(false)

onMounted(async () => {
  const res = await api.getRestaurants()
  restaurants.value = res.data
  cuisines.value = Array.from(new Set(res.data.map(r => r.cuisine)))
})

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

const openBooking = (restaurant) => {
  selectedRestaurant.value = restaurant
  isBookingModalOpen.value = true
}
</script>

<style scoped>
.card-title { font-size: 1.25rem; }
</style>
