<template>
  <div class="col-12 col-xl-4 col-md-6 mb-4">
    <div class="card h-100">
      <img
        v-if="imageSrc"
        :src="imageSrc"
        class="card-img-top"
        :alt="recipe.title"
        style="height: 200px; object-fit: cover"
      />
      
      <div v-else class="card-img-top bg-light d-flex align-items-center justify-content-center" style="height: 200px;">
        <span class="text-muted">Нет изображения</span>
      </div>

      <div class="card-body">
        <h5 class="card-title">{{ recipe.title }}</h5>
        <p class="card-text">Сложность: {{ recipe.difficulty }}</p>

        <router-link
          :to="`/recipe/${recipe.id}`"
          class="btn btn-success">
          Посмотреть полностью
        </router-link>
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
      required: true,
    }
  },

  computed: {
    imageSrc() {
      if (!this.recipe.image) return null
      
      const img = this.recipe.image
          
      try {
        return new URL(`../assets/img/${img}`, import.meta.url).href
      } 
      catch (e) {}
    }
  }
}
</script>