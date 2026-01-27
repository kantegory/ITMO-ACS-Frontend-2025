<template>
  <div class="card recipe-card h-100">
    <img :src="imageSrc" class="card-img-top" :alt="recipe.title">
    <div class="card-body">
      <h5 class="card-title">{{ recipe.title }}</h5>
      <p class="card-text">{{ recipe.description || 'Описание недоступно' }}</p>
      <div class="d-flex justify-content-between align-items-center">
        <small class="text-muted">Сложность: {{ recipe.difficulty }}</small>
        <router-link class="btn btn-sm btn-primary" :to="`/recipes/${recipe.id}`">Подробнее</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecipeCard',
  props: {
    recipe: {
      type: Object,
      required: true
    }
  },
  setup() {
    const imageSrc = 'https://cdn-icons-png.flaticon.com/512/4345/4345581.png'
    return { imageSrc }
  }
}
</script>