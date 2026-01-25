<script setup>
import { computed, onMounted, reactive } from 'vue'
import { useRestaurantsStore } from '../stores/restaurants.store'
import SearchFilters from '../components/SearchFilters.vue'
import RestaurantCard from '../components/RestaurantCard.vue'

const store = useRestaurantsStore()

const filters = reactive({ city: '', cuisine: '', price: '' })

onMounted(() => {
  store.loadAll()
})

const filtered = computed(() => {
  return store.items.filter(r => {
    if (filters.city && !r.city.toLowerCase().includes(filters.city.toLowerCase())) return false
    if (filters.cuisine && r.cuisine !== filters.cuisine) return false
    if (filters.price && r.price !== filters.price) return false
    return true
  })
})
</script>

<template>
  <div class="d-flex align-items-baseline justify-content-between flex-wrap gap-2 mb-3">
    <div>
      <h1 class="mb-1">Рестораны</h1>
      <div class="text-secondary">Демо-проект на Vue: поиск и бронирование столика.</div>
    </div>
  </div>

  <SearchFilters v-model="filters" />

  <div v-if="store.loading" class="alert alert-info mt-3">Загрузка…</div>
  <div v-else-if="store.error" class="alert alert-danger mt-3">Ошибка: {{ store.error }}</div>

  <div v-else class="row g-3 mt-1">
    <div class="col-12 col-md-6" v-for="r in filtered" :key="r.id">
      <RestaurantCard :item="r" />
    </div>
  </div>

  <div v-if="!store.loading && !filtered.length" class="alert alert-warning mt-3">
    Ничего не найдено.
  </div>
</template>
