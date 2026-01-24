<template>
  <base-layout>
    <div class="container m-4 p-2">
      <recipes-filters
        @all="loadAll"
        @type="filterByType"
        @difficulty="filterByDifficulty"
        @search="searchRecipes"
      />
      <div class="container-fluid mt-5 row mx-auto">
        <div class="row justify-content-center">
          <recipe-card
            v-for="recipe in recipes"
            :key="recipe.id"
            :recipe="recipe"/>
        </div>
        <p v-if="!recipes.length" class="text-muted text-center mt-4">Рецепты не найдены</p>
      </div>
    </div>
  </base-layout>
</template>

<script>
import BaseLayout from '@/layouts/BaseLayout.vue';
import RecipesFilters from '@/components/RecipesFilters.vue'
import RecipeCard from '@/components/RecipeCard.vue'

import useRecipesFilters from '@/composables/useRecipesFilters.js'

export default {
  name: 'MainPage',

  components: {
    BaseLayout,
    RecipesFilters,
    RecipeCard
  },

  setup() {
    const {
      recipes,
      loadAll,
      filterByType,
      filterByDifficulty,
      search
    } = useRecipesFilters()

    loadAll()

    return {
      recipes,
      loadAll,
      filterByType,
      filterByDifficulty,
      searchRecipes: search
    }
  }
}
</script>
