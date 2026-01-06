<template>
    <section class="hero text-center p-5">
      <h1>Добро пожаловать в «Лакомку»!</h1>
      <p class="lead">
        Находите вдохновение и делитесь любимыми рецептами с другими сладкоежками
        :3
      </p>
    </section>

    <RecipeFilters
      :search="search"
      :type="type"
      :difficulty="difficulty"
      @update:search="search = $event"
      @update:type="type = $event"
      @update:difficulty="difficulty = $event"
      @submit="loadRecipes"
      @reset="resetFilters"
    />

    <section class="container my-5">
      <h2 class="mb-4 text-center">Популярные рецепты</h2>

      <div class="row g-4">
        <div
          v-for="recipe in recipes"
          :key="recipe.id"
          class="col-md-4"
        >
          <RecipeCard :recipe="recipe" />
        </div>
      </div>

      <p v-if="!loading && recipes.length === 0" class="text-center">
        Ничего не найдено
      </p>
    </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRecipes } from '@/composable/useRecipes'

import RecipeCard from '@/components/RecipeCard.vue'
import RecipeFilters from '@/components/RecipeFilters.vue'

const {
  recipes,
  loading,
  search,
  type,
  difficulty,
  loadRecipes,
  resetFilters
} = useRecipes()

onMounted(loadRecipes)
</script>

<style scoped>
.hero {
  background-color: #ffece3;
  border-radius: 0 0 2rem 2rem;
}
</style>
