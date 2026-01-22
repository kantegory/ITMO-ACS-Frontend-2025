<template>
  <div>
    <h1 class="mb-4">Поиск ресторанов</h1>

    <!-- фильтры -->
    <div class="row g-3 mb-4">
      <div class="col-md-4">
        <input v-model="searchQuery" type="text" class="form-control" placeholder="Название/кухня">
      </div>

      <div class="col-md-4">
        <select v-model="district" class="form-select">
          <option>Район</option>
          <option>Центральный</option>
          <option>Петроградский</option>
          <option>Адмиралтейский</option>
          <option>Василеостровский</option>
        </select>
      </div>

      <div class="col-md-4">
        <select v-model="price" class="form-select">
          <option>Цена</option>
          <option>₽ Дёшево</option>
          <option>₽₽ Средне</option>
          <option>₽₽₽ Дорого</option>
        </select>
      </div>
    </div>

    <!-- карточки ресторанов -->
    <div class="row" v-if="filteredRestaurants.length">
      <RestaurantCard
        v-for="r in filteredRestaurants"
        :key="r.id"
        :restaurant="r"
      />
    </div>
    <p v-else class="text-danger">Нет ресторанов</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useApi } from '@/composables/useApi'
import RestaurantCard from '@/components/RestaurantCard.vue'

const { fetchRestaurants } = useApi()

const restaurants  = ref([])
const searchQuery = ref('')
const district    = ref('Район')
const price       = ref('Цена')

// загружаем рестораны один раз при монтировании
onMounted(async () => {
  restaurants.value = await fetchRestaurants()
})

// вычисляем отфильтрованный список
const filteredRestaurants = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()

  return restaurants.value.filter(r => {
    const matchesSearch =
      q === '' ||
      r.name.toLowerCase().includes(q) ||
      r.type.toLowerCase().includes(q)

    const matchesDistrict = district.value === 'Район' || r.location === district.value
    const matchesPrice    = price.value    === 'Цена'   || r.price    === price.value

    return matchesSearch && matchesDistrict && matchesPrice
  })
})
</script>