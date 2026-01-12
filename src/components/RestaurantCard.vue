<template>
  <div class="col-md-3 mb-4">
    <div class="card h-100">
      <img 
        :src="getImageUrl(restaurant.images[0])" 
        class="card-img-top" 
        :alt="restaurant.name"
        style="height: 200px; object-fit: cover;"
      >
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">{{ restaurant.name }}</h5>
        <p class="card-text">{{ restaurant.cuisine }}, {{ restaurant.location }}, {{ restaurant.price }}</p>
        <router-link 
          :to="`/restaurant/${restaurant.id}`" 
          class="btn btn-primary mt-auto"
        >
          Подробнее
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Restaurant } from '@/types'
import { resolveImage } from '@/assets/imageMap'

defineProps<{
  restaurant: Restaurant
}>()

const getImageUrl = (path: string) => {
  return resolveImage(path) || ''
}
</script>

