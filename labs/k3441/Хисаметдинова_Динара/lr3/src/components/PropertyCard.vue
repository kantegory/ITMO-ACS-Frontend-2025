<template>
  <div class="card border-0 shadow-sm rounded-4" @click="goToProperty">
    <div class="position-relative">
      <img
        :src="property.image"
        class="card-img-top rounded-top-4"
        :alt="`${property.title} in ${property.location}`"
        loading="lazy"
      >
      <span class="badge bg-success position-absolute top-0 start-0 m-2">Gateway Deal</span>
      <button
        class="btn btn-light rounded-circle position-absolute top-0 end-0 m-2"
        @click.stop="toggleFavorite"
        aria-label="Add to favorites"
      >
        <i :class="isFavorite ? 'fas fa-heart text-danger' : 'far fa-heart'" aria-hidden="true"></i>
      </button>
    </div>
    <div class="card-body p-3">
      <div class="d-flex align-items-center mb-2">
        <span class="text-warning">★ {{ property.rating }}</span>
        <small class="text-muted ms-2">{{ getRatingText(property.rating) }}</small>
        <small class="text-muted ms-auto">{{ property.reviews }} reviews</small>
      </div>
      <h3 class="card-title h5">{{ property.title }}</h3>
      <p class="card-text text-muted small mb-2">{{ property.location }}</p>
      <p class="card-text text-muted small mb-3">{{ property.type }} • {{ property.maxGuests }} guests</p>
      <div class="mt-auto">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <span class="h5 mb-0 text-primary">${{ property.price }}</span>
            <small class="text-muted d-block">per night</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

interface Property {
  id: number
  title: string
  location: string
  type: string
  price: number
  rating: number
  reviews: number
  image: string
  amenities: string[]
  maxGuests: number
  bedrooms: number
  bathrooms: number
  description: string
}

interface Props {
  property: Property
}

const props = defineProps<Props>()
const router = useRouter()
const isFavorite = ref(false)

const goToProperty = () => {
  router.push({ name: 'property', params: { id: props.property.id } })
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
}

const getRatingText = (rating: number): string => {
  if (rating >= 4.5) return 'Excellent'
  if (rating >= 4.0) return 'Very Good'
  if (rating >= 3.5) return 'Good'
  return 'Fair'
}
</script>

<style scoped>
.card {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  min-height: 420px;
  height: auto;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--card-bg) !important;
  border-color: var(--border-color) !important;
  color: var(--text-color) !important;
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

[data-theme="dark"] .card:hover {
  box-shadow: 0 8px 25px rgba(0,0,0,0.4);
}

.card-img-top {
  width: 100%;
  height: 220px;
  object-fit: cover;
}

.card-title {
  color: var(--text-color) !important;
}

.badge {
  font-size: 0.75rem;
}

.btn-light {
  background: rgba(255, 255, 255, 0.9);
  border: none;
}

.btn-light:hover {
  background: white;
}

[data-theme="dark"] .btn-light {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-color);
}

[data-theme="dark"] .btn-light:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>