<template>
  <div class="col-md-6 mb-4">
    <div class="card h-100 listing-card">
      <img :src="`/${listing.image}`" class="card-img-top" :alt="listing.title">
      <div class="card-body">
        <h5 class="card-title">{{ listing.title }}</h5>
        <p class="card-text">
          <span class="price">Цена: {{ formatPrice(listing.price) }} ₽ / мес</span>
          <span class="location"> · Район: {{ listing.location }}</span>
        </p>
        <button 
          class="btn btn-outline-primary btn-details"
          @click="$emit('show-details', listing)"
        >
          <svg class="icon" aria-hidden="true"><use href="#icon-eye"></use></svg>
          Подробнее
        </button>
        <button 
          v-if="isAuthenticated"
          class="btn btn-primary ms-2"
          @click="$emit('book', listing)"
        >
          <svg class="icon" aria-hidden="true"><use href="#icon-calendar"></use></svg>
          Арендовать
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuth } from '@/composables/useAuth'

const props = defineProps({
  listing: {
    type: Object,
    required: true
  }
})

defineEmits(['show-details', 'book'])

const { isAuthenticated } = useAuth()

const formatPrice = (price) => {
  return new Intl.NumberFormat('ru-RU').format(price)
}
</script>

<style scoped>
.listing-card {
  border-radius: 15px;
  box-shadow: 0 6px 12px rgba(0,0,0,0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.listing-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.2);
}

.card-img-top {
  height: 200px;
  object-fit: cover;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

.price {
  font-weight: bold;
  color: #452cb3;
}

.icon {
  width: 1em;
  height: 1em;
  display: inline-block;
  vertical-align: middle;
  margin-right: 0.25em;
}
</style>

