<script setup>
defineProps({
  recipe: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="card recipe-card h-100">
    <img
      :src="recipe.image"
      class="card-img-top"
      :alt="recipe.title"
    />

    <div class="card-body">
      <h5 class="card-title">{{ recipe.title }}</h5>
      <p class="card-text">{{ recipe.description }}</p>

      <router-link
        :to="`/recipe/${recipe.id}`"
        class="btn btn-outline-primary w-100"
      >
        Смотреть рецепт
      </router-link>
    </div>
  </div>
</template>
