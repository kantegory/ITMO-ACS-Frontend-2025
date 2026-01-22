<template>
  <div class="container py-5">
    <h1 class="mb-4">
      <i class="bi bi-shop me-2"></i>
      Рестораны
    </h1>

    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-3">
            <label class="form-label small text-muted">
              <i class="bi bi-search me-1"></i>Поиск
            </label>
            <input 
              v-model="searchQuery" 
              type="text" 
              class="form-control" 
              placeholder="Название ресторана..."
            >
          </div>

          <div class="col-md-3">
            <label class="form-label small text-muted">
              <i class="bi bi-geo-alt me-1"></i>Местоположение
            </label>
            <select v-model="selectedLocation" class="form-select">
              <option value="">Все районы</option>
              <option value="Центр">Центр</option>
              <option value="Север">Север</option>
              <option value="Юг">Юг</option>
              <option value="Запад">Запад</option>
              <option value="Восток">Восток</option>
            </select>
          </div>

          <div class="col-md-3">
            <label class="form-label small text-muted">
              <i class="bi bi-cup-hot me-1"></i>Кухня
            </label>
            <select v-model="selectedCuisine" class="form-select">
              <option value="">Все кухни</option>
              <option value="Итальянская">Итальянская</option>
              <option value="Японская">Японская</option>
              <option value="Французская">Французская</option>
              <option value="Русская">Русская</option>
              <option value="Грузинская">Грузинская</option>
            </select>
          </div>

          <div class="col-md-3">
            <label class="form-label small text-muted">
              <i class="bi bi-cash me-1"></i>Цена
            </label>
            <select v-model="selectedPrice" class="form-select">
              <option value="">Любая цена</option>
              <option value="₽">₽ - Бюджетно</option>
              <option value="₽₽">₽₽ - Средний</option>
              <option value="₽₽₽">₽₽₽ - Премиум</option>
            </select>
          </div>
        </div>

        <div class="row mt-3" v-if="hasActiveFilters">
          <div class="col-12">
            <button @click="resetFilters" class="btn btn-outline-secondary btn-sm">
              <i class="bi bi-x-circle me-1"></i>
              Сбросить фильтры
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-3">
      <p class="text-muted">
        Найдено: <strong>{{ filteredRestaurants.length }}</strong> 
        {{ getRestaurantsText(filteredRestaurants.length) }}
      </p>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Загрузка...</span>
      </div>
    </div>

    <div v-else-if="filteredRestaurants.length > 0" class="row">
      <div v-for="restaurant in filteredRestaurants" :key="restaurant.id" class="col-md-4 mb-4">
        <RestaurantCard :restaurant="restaurant" />
      </div>
    </div>

    <div v-else class="text-center py-5">
      <i class="bi bi-search display-1 text-muted"></i>
      <p class="text-muted mt-3">Рестораны не найдены</p>
      <button @click="resetFilters" class="btn btn-primary">
        Показать все рестораны
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import RestaurantCard from '../components/RestaurantCard.vue'
import { restaurantService } from '../services/restaurantService'

const restaurants = ref([])
const loading = ref(true)
const searchQuery = ref('')
const selectedLocation = ref('')
const selectedCuisine = ref('')
const selectedPrice = ref('')

const filteredRestaurants = computed(() => {
  return restaurants.value.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesLocation = !selectedLocation.value || restaurant.location === selectedLocation.value
    const matchesCuisine = !selectedCuisine.value || restaurant.cuisine === selectedCuisine.value
    const matchesPrice = !selectedPrice.value || restaurant.price === selectedPrice.value
    return matchesSearch && matchesLocation && matchesCuisine && matchesPrice
  })
})

const hasActiveFilters = computed(() => {
  return searchQuery.value || selectedLocation.value || selectedCuisine.value || selectedPrice.value
})

const resetFilters = () => {
  searchQuery.value = ''
  selectedLocation.value = ''
  selectedCuisine.value = ''
  selectedPrice.value = ''
}

const getRestaurantsText = (count) => {
  if (count === 1) return 'ресторан'
  if (count >= 2 && count <= 4) return 'ресторана'
  return 'ресторанов'
}

onMounted(async () => {
  try {
    const response = await restaurantService.getAll()
    restaurants.value = response.data
  } catch (error) {
    loading.value = false
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.form-label {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.card {
  border: none;
}
</style>
