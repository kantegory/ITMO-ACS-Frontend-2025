<template>
  <main class="container mt-5">
    <h2>Добро пожаловать!</h2>
    <p>Забронируйте столик в любимом ресторане легко и быстро.</p>
    
    <section class="my-5">
      <h3>Поиск ресторанов</h3>
      <form @submit.prevent="handleSearch" class="row g-3">
        <div class="col-md-4">
          <label for="cuisine" class="form-label">Кухня</label>
          <select v-model="filters.cuisine" class="form-select" id="cuisine">
            <option value="">Все</option>
            <option>Итальянская</option>
            <option>Японская</option>
            <option>Русская</option>
            <option>Фастфуд</option>
          </select>
        </div>
        <div class="col-md-4">
          <label for="location" class="form-label">Расположение</label>
          <select v-model="filters.location" class="form-select" id="location">
            <option value="">Все</option>
            <option>Центр</option>
            <option>Север</option>
            <option>Юг</option>
            <option>Восток</option>
          </select>
        </div>
        <div class="col-md-4">
          <label for="price" class="form-label">Цена</label>
          <select v-model="filters.price" class="form-select" id="price">
            <option value="">Любая</option>
            <option>₽</option>
            <option>₽₽</option>
            <option>₽₽₽</option>
          </select>
        </div>
        <div class="col-12">
          <button type="submit" class="btn btn-primary">Найти</button>
        </div>
      </form>
    </section>

    <section v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Загрузка...</span>
      </div>
    </section>

    <section v-else-if="error" class="alert alert-danger">
      {{ error }}
    </section>

    <section v-else class="row">
      <RestaurantCard 
        v-for="restaurant in restaurants" 
        :key="restaurant.id" 
        :restaurant="restaurant"
      />
      <div v-if="restaurants.length === 0" class="col-12">
        <p class="text-center">Рестораны не найдены</p>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import RestaurantCard from '@/components/RestaurantCard.vue'
import { useRestaurants } from '@/composables/useRestaurants'

const { restaurants, loading, error, fetchRestaurants } = useRestaurants()

const filters = reactive({
  cuisine: '',
  location: '',
  price: ''
})

onMounted(() => {
  fetchRestaurants()
})

const handleSearch = () => {
  fetchRestaurants(filters)
}
</script>
