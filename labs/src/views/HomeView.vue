<template>
  <AppNavbar />

  <div class="container mt-4">
    <h1>Популярные рецепты</h1>

    <div class="row" v-if="recipes.length > 0">
      <RecipeCard v-for="recipe in recipes" :key="recipe.id" :recipe="recipe" />
    </div>

    <div v-else class="text-center my-5">
      <p>Загрузка рецептов...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppNavbar from '@/components/AppNavbar.vue'
import RecipeCard from '@/components/RecipeCard.vue'
import { useApi } from '@/composables/useApi.js'

const { getRecipes } = useApi()
const recipes = ref([])

onMounted(async () => {
  recipes.value = await getRecipes()
})
</script>