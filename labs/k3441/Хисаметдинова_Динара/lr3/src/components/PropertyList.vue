<template>
  <div class="row g-4">
    <div
      v-for="property in properties"
      :key="property.id"
      class="col-lg-3 col-md-6"
    >
      <PropertyCard :property="property" />
    </div>
  </div>
</template>

<script setup lang="ts">
import PropertyCard from './PropertyCard.vue'

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
  properties: Property[]
}

defineProps<Props>()
</script>