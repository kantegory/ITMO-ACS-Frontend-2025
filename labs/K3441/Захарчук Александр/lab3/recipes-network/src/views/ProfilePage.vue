<script setup>
import Navbar from "@/components/Navbar.vue";
import { useUserStore } from "@/stores/user";
import { onMounted } from "vue";
import router from "@/router";
import UserCard from "@/components/UserCard.vue";
import { useRecipeStore } from "@/stores/recipe";
import RecipeCard from "@/components/RecipeCard.vue";

const userStore = useUserStore();
const recipeStore = useRecipeStore();

onMounted(async () => {
  try {
    await userStore.getCurrentUser();
    await userStore.getSubs();
    await recipeStore.load(null, userStore.currentUser.id);
  } catch (error) {
    console.error("Ошибка загрузки пользователя:", error);
    userStore.logout();
  }
});

if (!userStore.isAuthenticated) {
  router.push("/login");
}
</script>

<template>
  <Navbar />
  <main class="container my-5">
    <div class="row">
      <div class="col-lg-4 mb-4">
        <div class="card shadow-sm border-0 mb-4">
          <div class="card-body text-center">
            <div class="position-relative d-inline-block mb-3">
              <img
                :src="userStore.user.profile_picture"
                :alt="userStore.user.username"
                id="userImage"
                height="100"
                width="100"
                style="border-radius: 100px; object-fit: cover"
              />
            </div>
            <h4 class="card-title mb-1" id="userName">{{ userStore.user.username }}</h4>
            <p class="text-muted mb-1" id="userEmail">{{ userStore.user.email }}</p>
            <p class="strong mb-3" id="userBio">{{ userStore.user.bio }}</p>

            <button @click="userStore.logout" class="btn btn-outline-danger w-100 mt-3">Выйти</button>
          </div>
        </div>

        <div class="card shadow-sm border-0">
          <div class="card-body">
            <div class="nav flex-column">
              <a
                class="nav-link active d-flex align-items-center py-2"
                href="#my-recipes"
                data-bs-toggle="tab"
              >
                <span>Мои рецепты</span>
              </a>
              <a
                class="nav-link d-flex align-items-center py-2"
                href="#following"
                data-bs-toggle="tab"
              >
                <span>Подписки</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-8">
        <div class="tab-content">
          <div class="tab-pane fade show active" id="my-recipes">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h4 class="mb-0">Мои рецепты</h4>
              <router-link class="btn btn-danger" :to="{ name: 'create-recipe' }">Добавить рецепт</router-link>
            </div>

            <div class="row mb-5">
              <div class="col-12">
                <div class="row g-4">
                  <RecipeCard
                    v-for="recipe in recipeStore.all"
                    :name="recipe.title"
                    :imageLink="recipe.picture"
                    :description="recipe.description"
                    :id="recipe.id"
                    maxHeight="220"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="tab-pane fade" id="following">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h4 class="mb-0">Подписки</h4>
              <span class="badge bg-secondary" id="followingTotal"
                >{{ userStore.subscriptions.length }} подписок</span
              >
            </div>

            <div class="card shadow-sm border-0">
              <div class="card-body">
                <div class="row">
                  <UserCard
                    v-for="sub in userStore.subscriptions"
                    :name="sub.followed.username"
                    :description="sub.followed.bio"
                    :imageLink="sub.followed.profile_picture"
                    :id="sub.followed.id"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<style scoped>
  span {
    color: black;
  }
</style>
