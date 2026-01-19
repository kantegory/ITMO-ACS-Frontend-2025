<template>
  <div>
    <h1>Рецепты</h1>

    <input
      v-model="query"
      type="text"
      class="form-control mb-4"
      placeholder="Поиск по названию рецепта"
    />

    <div v-if="loading">Загрузка...</div>
    <div v-else-if="error">Ошибка загрузки данных</div>

    <div v-else class="row g-3">
      <div
        v-for="recipe in filteredRecipes"
        :key="recipe.id"
        class="col-md-4"
      >
        <RecipeCard :recipe="recipe" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRecipes } from '@/composables/useRecipes'
import RecipeCard from '@/components/RecipeCard.vue'

const query = ref('')

const { recipes, loading, error } = useRecipes()

const filteredRecipes = computed(() => {
  return recipes.value.filter(recipe =>
    recipe.title.toLowerCase().includes(query.value.toLowerCase())
  )
})
</script>
