<script setup>
import Navbar from "@/components/Navbar.vue";
import RecipeCard from "@/components/RecipeCard.vue";
import { useRecipeStore } from "@/stores/recipe";
import { ref } from "vue";

const searchText = ref();
const recipeStore = useRecipeStore();

const handleSearch = async () => {
  const filter = searchText.value.trim();

  if (filter) {
    await recipeStore.load(filter);
  }
};
</script>

<template>
  <Navbar />
  <main class="container my-5">
    <div class="row mb-5">
      <div class="col-12">
        <div class="text-center mb-4">
          <h1 class="display-5 fw-bold text-danger mb-3">Найдите идеальный рецепт</h1>
          <p class="lead text-muted">
            Откройте для себя тысячи рецептов от шеф-поваров и домашних кулинаров
          </p>
        </div>

        <div class="row justify-content-center">
          <div class="col-md-8">
            <form @submit.prevent="handleSearch">
              <div class="input-group input-group-lg shadow-sm">
                <input
                  v-model="searchText"
                  type="text"
                  class="form-control border-0"
                  id="searchInput"
                  placeholder="Введите название рецепта, ингредиент или кухню..."
                  required="true"
                />
                <button class="btn btn-danger px-4" type="submit">Найти</button>
              </div>
            </form>
          </div>
        </div>

        <div class="row mt-4">
          <div class="col-12">
            <div class="row g-4">
              <RecipeCard
                v-for="recipe in recipeStore.all"
                :name="recipe.title"
                :imageLink="recipe.picture"
                :description="recipe.description"
                :id="recipe.id"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
