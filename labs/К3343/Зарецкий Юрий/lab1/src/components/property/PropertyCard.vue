<template>
  <div class="col-md-6 col-lg-4 mb-4">
    <div class="card h-100 property-card">
      <img 
        :src="property.image" 
        class="card-img-top" 
        :alt="`Фотография недвижимости: ${property.title}, расположена по адресу ${property.location}`"
        style="height: 200px; object-fit: cover;"
      />
      <div class="card-body">
        <h5 class="card-title">{{ property.title }}</h5>
        <p class="card-text text-muted">{{ property.location }}</p>
        <p v-if="property.description" class="card-text property-description">
          {{ property.description }}
        </p>
        <p class="card-text">
          <strong class="text-primary">{{ formatPrice(property.price) }}</strong>
        </p>
        <router-link 
          :to="`/property/${property.id}`" 
          class="btn btn-primary btn-sm mt-auto"
        >
          Подробнее
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  property: {
    type: Object,
    required: true
  }
})

const formatPrice = (price) => {
  return `${price.toLocaleString('ru-RU')} ₽/мес`
}
</script>

<style scoped>
.property-card .card-body {
  display: flex;
  flex-direction: column;
}

.property-card .property-description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 0;
  margin-bottom: 0.5rem;
}
</style>
