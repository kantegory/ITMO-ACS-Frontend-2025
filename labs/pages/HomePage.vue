<template>
  <div>
    <h1>Рецепты</h1>

    <div v-if="loading">Загрузка...</div>
    <div v-else-if="error">Ошибка загрузки данных</div>

    <div v-else class="row g-3">
      <div
        v-for="recipe in recipes"
        :key="recipe.id"
        class="col-md-4"
      >
        <RecipeCard :recipe="recipe" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRecipes } from '@/composables/useRecipes'
import RecipeCard from '@/components/RecipeCard.vue'

const { recipes, loading, error } = useRecipes()
</script>
