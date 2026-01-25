<template>
  <profile-layout>
    <section class="filter-section" aria-labelledby="filter-title">
      <h1 id="filter-title" class="mb-3 fs-4">Поиск ресторанов</h1>

      <form @submit.prevent="applyFilters">
        <div class="row g-2">
          <div class="col-md-4">
            <label class="form-label small">Кухня</label>
            <select v-model="filters.cuisine" class="form-select form-select-sm">
              <option value="">Все</option>
              <option value="Italian">Итальянская</option>
              <option value="Asian">Азиатская</option>
              <option value="French">Французская</option>
              <option value="North">Северная</option>
            </select>
          </div>

          <div class="col-md-4">
            <label class="form-label small">Расположение</label>
            <select v-model="filters.location" class="form-select form-select-sm">
              <option value="">Все районы</option>
              <option value="Centre">Центральный</option>
              <option value="Primorsky">Приморский</option>
              <option value="Autozavodsky">Автозаводский</option>
            </select>
          </div>

          <div class="col-md-4">
            <label class="form-label small">Цена</label>
            <select v-model="filters.price" class="form-select form-select-sm">
              <option value="">Любая</option>
              <option value="1">$</option>
              <option value="2">$$</option>
              <option value="3">$$$</option>
            </select>
          </div>
        </div>

        <div class="mt-3 text-end">
          <button class="btn btn-primary btn-sm px-4">
            Применить
          </button>
        </div>
      </form>
    </section>

    <section class="mt-4 px-5" aria-label="Список ресторанов">
      <p v-if="!restaurants.length" class="mt-3">
        Нет ресторанов, соответствующих фильтрам.
      </p>

      <article
        v-for="r in restaurants"
        :key="r.id"
        class="restaurant-card"
      >
        <figure>
          <img
            class="restaurant-img"
            :src="r.img"
            :alt="r.name"
          >
        </figure>

        <div>
          <h2 class="restaurant-name fs-5">
            <router-link
              :to="`/restaurants/${r.id}`"
              class="text-decoration-none"
            >
              {{ r.name }}
            </router-link>
          </h2>

          <p class="m-0">Кухня: {{ cuisineMap[r.cuisine] }}</p>
          <p class="m-0">Район: {{ locationMap[r.location] }}</p>
          <p class="m-0">Цена: {{ '$'.repeat(r.price) }}</p>
        </div>
      </article>
    </section>
  </profile-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ProfileLayout from '@/layouts/ProfileLayout.vue'
import { useRestaurantsStore } from '@/stores/restaurant.js'

const restaurantsStore = useRestaurantsStore()

const filters = ref({
  cuisine: '',
  location: '',
  price: ''
})

const cuisineMap = {
  Italian: 'Итальянская',
  Asian: 'Азиатская',
  French: 'Французская',
  North: 'Северная'
}

const locationMap = {
  Centre: 'Центральный',
  Primorsky: 'Приморский',
  Autozavodsky: 'Автозаводский'
}

const restaurants = computed(() => restaurantsStore.restaurants)

const applyFilters = () => {
  const params = {}

  if (filters.value.cuisine) params.cuisine = filters.value.cuisine
  if (filters.value.location) params.location = filters.value.location
  if (filters.value.price) params.price = Number(filters.value.price)

  restaurantsStore.loadRestaurants(params)
}

onMounted(() => {
  restaurantsStore.loadRestaurants()
})
</script>
