<template>
  <div class="card h-100 restaurant-card">
    <img :src="restaurant.image" class="card-img-top" :alt="restaurant.name">
    <div class="card-body d-flex flex-column">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <h5 class="card-title mb-0">{{ restaurant.name }}</h5>
        <span class="badge bg-primary">{{ restaurant.price }}</span>
      </div>
      
      <div class="mb-2">
        <small class="text-muted">
          <i class="bi bi-geo-alt-fill text-primary me-1"></i>
          {{ restaurant.location }}
        </small>
      </div>

      <div class="mb-2">
        <span class="badge bg-success me-1">{{ restaurant.cuisine }}</span>
        <span class="text-warning">
          <i class="bi bi-star-fill"></i> {{ restaurant.rating }}
        </span>
        <small class="text-muted ms-1">({{ restaurant.reviews }} отзывов)</small>
      </div>

      <p class="card-text text-muted small mb-3">{{ restaurant.description }}</p>

      <div class="mt-auto">
        <router-link 
          :to="`/restaurants/${restaurant.id}`" 
          class="btn btn-primary w-100"
        >
          <i class="bi bi-info-circle me-2"></i>
          Подробнее
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  restaurant: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.restaurant-card {
  border: none;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.07);
  transition: transform 0.3s, box-shadow 0.3s;
}

.restaurant-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.15);
}

.card-img-top {
  height: 220px;
  object-fit: cover;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
}

.badge {
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
}

.btn-primary {
  border-radius: 8px;
  font-weight: 500;
  padding: 0.625rem 1rem;
  color: #ffffff !important;
  opacity: 1 !important;
}

.btn-primary:hover,
.btn-primary:focus,
.btn-primary:active {
  color: #ffffff !important;
  opacity: 1 !important;
}
</style>
