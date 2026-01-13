<template>
  <div class="card h-100 themed-btn">
    <img :src="restaurant.img" class="card-img-top" :alt="restaurant.name" />
    <div class="card-body">
      <h3 class="card-title">{{ restaurant.name }}</h3>
      <p class="card-text text-muted">
        {{ restaurant.cuisine }} · {{ restaurant.location }} · {{ '₽'.repeat(restaurant.price) }}
      </p>
      <div class="d-flex gap-2">
        <router-link :to="`/restaurant/${restaurant.id}`" class="btn btn-outline-secondary">
          Подробнее
        </router-link>
        <button class="btn btn-primary" @click="bookNow">Забронировать</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  restaurant: Object
})

const emit = defineEmits(['open-booking'])

function bookNow() {
  emit('open-booking', props.restaurant)
}
</script>

<style scoped>
.card { cursor: pointer; }
</style>
