<template>
  <div id="propertyCarousel" class="carousel slide" data-bs-ride="carousel" role="region" aria-label="Галерея изображений недвижимости">
    <div class="carousel-inner">
      <div 
        v-for="(image, index) in images" 
        :key="index"
        class="carousel-item"
        :class="{ active: index === 0 }"
      >
        <img 
          :src="image" 
          class="d-block w-100" 
          :alt="`Фотография ${index + 1} из ${images.length}: ${title}, ${location}`"
          style="height: 500px; object-fit: cover;"
        >
      </div>
    </div>
    <button 
      class="carousel-control-prev" 
      type="button" 
      data-bs-target="#propertyCarousel" 
      data-bs-slide="prev"
      aria-label="Предыдущее изображение"
    >
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    </button>
    <button 
      class="carousel-control-next" 
      type="button" 
      data-bs-target="#propertyCarousel" 
      data-bs-slide="next"
      aria-label="Следующее изображение"
    >
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
    </button>
  </div>
</template>

<script setup>
defineProps({
  images: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.carousel-item img {
  border-radius: 10px;
}
</style>
