<template>
  <div class="row">
    <div v-for="recipe in recipes" :key="recipe.id" class="col-md-4 mb-4">
      <RecipeCard :recipe="recipe" />
    </div>
  </div>
</template>

<script>
import RecipeCard from './RecipeCard.vue'

export default {
  name: 'RecipeList',
  components: {
    RecipeCard
  },
  props: {
    recipes: {
      type: Array,
      required: true
    }
  }
}
</script>