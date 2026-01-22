<!-- src/components/RestaurantCard.vue -->
<script setup>
import { Info, Calendar } from 'lucide-vue-next'

const props = defineProps({
  restaurant: Object
})
const emit = defineEmits(['open-booking'])

function bookNow() {
  emit('open-booking', props.restaurant)
}
</script>

<template>
  <div class="card h-100 themed-btn">
    <img :src="restaurant.img" class="restaurant-img" :alt="restaurant.name" />
    <div class="card-body d-flex flex-column">
      <h3 class="card-title">{{ restaurant.name }}</h3>
      <p class="card-text text-muted">
        {{ restaurant.cuisine }} · {{ restaurant.location }} · {{ '₽'.repeat(restaurant.price) }}
      </p>
      <div class="d-flex gap-2 mt-auto">
        <router-link :to="`/restaurant/${restaurant.id}`" class="btn btn-outline-secondary">
          <Info width="16" height="16" /> Подробнее
        </router-link>
        <button class="btn btn-primary" @click="bookNow">
          <Calendar width="16" height="16" /> Забронировать
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  cursor: pointer;
  transition: transform 0.2s;
}
.card {
  background-color: var(--card-bg);
  color: var(--text-color);
  box-shadow: 0 4px 12px var(--card-shadow);
  border: none;
}

.card:hover {
  transform: scale(1.03);
}

/* Картинка ресторана одинакового размера */
.restaurant-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  transition: transform 0.3s;
}
.card:hover .restaurant-img {
  transform: scale(1.05);
}
</style>
