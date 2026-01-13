<script setup>
import Navbar from '@/components/Navbar.vue';
import RecipeCard from '@/components/RecipeCard.vue';
import UserCard from '@/components/UserCard.vue';
import { useRecipeStore } from '@/stores/recipe';
import { useUserStore } from '@/stores/user';
import { onMounted } from 'vue';

const recipeStore = useRecipeStore();
const userStore = useUserStore();

onMounted(async () => {
  try {
    await recipeStore.load();
    await userStore.getAll();
  } catch (error) {
    console.error('Ошибка загрузки рецептов:', error);
  }
});

</script>

<template>
    <Navbar />
    <main class="container my-5">
      <div class="row mb-4">
        <div class="col-12">
          <h1 class="display-4 fw-bold text-danger">Кулинарное сообщество</h1>
          <p class="lead text-muted">
            Откройте для себя лучшие рецепты со всего мира
          </p>
        </div>
      </div>

      <div class="row mb-5">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="text-danger">Популярные рецепты</h2>
          </div>
          <div class="row g-4">
            <RecipeCard v-for="recipe in recipeStore.all" :name=recipe.title :imageLink=recipe.picture :description=recipe.description :id=recipe.id />
          </div>
        </div>
      </div>

      <div class="row mb-5">
        <div class="col-12">
          <h2 class="text-danger mb-4">Популярные авторы</h2>
          <div class="row g-4">
            <UserCard v-for="user in userStore.all" :name="user.username" :description="user.bio" :imageLink="user.profile_picture" :id="user.id" />
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="card bg-danger text-white shadow-sm border-0">
            <div class="card-body p-5 text-center">
              <h2 class="card-title mb-3">Станьте частью нашего сообщества</h2>
              <p class="card-text mb-4">
                Присоединяйтесь к тысячам кулинаров, делитесь своими рецептами и
                находите вдохновение
              </p>
              <div class="d-flex justify-content-center gap-3">
                <router-link v-if="!userStore.isAuthenticated" class="btn btn-light btn-lg" :to="{ name: 'register' }">Зарегистрироваться</router-link>
                <router-link class="btn btn-outline-light btn-lg" :to="{ name: 'search' }">Искать рецепты</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
</template>
