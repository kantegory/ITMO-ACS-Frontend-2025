<template>
  <div class="card h-100 shadow-sm">
    <img
      :src="imageSrc"
      class="card-img-top"
      alt="Recipe image"
    />

    <div class="card-body d-flex flex-column">
      <h5 class="card-title">
        {{ recipe.title }}
      </h5>

      <p class="card-text">
        {{ recipe.short|| 'Описание отсутствует' }}
      </p>

      <RouterLink
        :to="`/recipe/${recipe.id}`"
        class="btn btn-primary mt-auto"
      >
        Открыть рецепт
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  recipe: {
    type: Object,
    required: true
  }
})

const imageSrc = computed(() => {
  return (
    props.recipe.image ||
    props.recipe.images?.[0] ||
    'https://via.placeholder.com/300x200?text=Recipe'
  )
})
</script>
