<script setup>
import CommentCard from "@/components/CommentCard.vue";
import Navbar from "@/components/Navbar.vue";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useRecipeStore } from "@/stores/recipe";
import { useCommentStore } from "@/stores/comment";
import { useUserStore } from "@/stores/user";
import constants from '@/helpers/constants';

const route = useRoute();
const recipeId = parseInt(route.params.recipeId);
const recipeStore = useRecipeStore();
const commentStore = useCommentStore();
const userStore = useUserStore();

onMounted(async () => {
  try {
    await recipeStore.loadById(recipeId);
    await commentStore.getByRecipeId(recipeId);
    await userStore.getAll();
  } catch (error) {
    console.error("Ошибка загрузки рецепта:", error);
  }
});

const commentText = ref();

const getCommentAuthor = (userId) => {
  const user = userStore.getById(userId);
  if(user) {
    return user.username;
  }
  return "Guest";
};

const handleCommentCreate = async () => {
  const text = commentText.value.trim();
  if (text && text.length >= 10) {
    await commentStore.create(recipeId, text);
  }
};
</script>

<template>
  <Navbar />
  <main class="container my-5">
    <div class="row">
      <div class="col-lg-8">
        <div class="card shadow-sm border-0 mb-4">
          <h1 class="display-6 fw-bold text-danger mb-2 p-3 pb-0" id="recipeTitle">
            {{ recipeStore.recipe.title }}
          </h1>
          <div class="card-body">
            <img
              :src="recipeStore.recipe.picture"
              :alt="recipeStore.recipe.title"
              class="img-fluid rounded-start"
              style="height: 400px; width: 100%; object-fit: cover"
              id="mainPicture"
            />
          </div>
        </div>

        <div class="card shadow-sm border-0 mb-4">
          <div class="card-body">
            <h4 class="text-danger mb-4">Ингредиенты</h4>
            <div class="row">
              <div class="col-md-6">
                <ul id="ingredientsList">
                  <li v-for="ingredient in recipeStore.recipe.ingredients">
                    <strong>{{ ingredient.ingredient.name }}</strong> - {{ ingredient.quantity }}
                    {{ constants.units[ingredient.unit] }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="card shadow-sm border-0 mb-4">
          <div class="card-body">
            <h4 class="text-danger mb-4">Пошаговое приготовление</h4>
            <div class="card-text" id="recipeSteps" style="white-space: pre-wrap">
              {{ recipeStore.recipe.description }}
            </div>
          </div>
        </div>

        <div class="card shadow-sm border-0">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h4 class="text-danger mb-0">Комментарии</h4>
            </div>

            <div class="mb-4">
              <div class="d-flex gap-3">
                <div class="flex-grow-1">
                  <textarea
                    v-model="commentText"
                    class="form-control"
                    id="commentText"
                    placeholder="Напишите ваш комментарий..."
                    rows="3"
                  ></textarea>
                  <div class="d-flex justify-content-between align-items-center mt-2">
                    <small class="text-muted">Минимум 10 символов</small>
                    <button @click="handleCommentCreate" class="btn btn-danger" id="submitCommentBtn">Отправить</button>
                  </div>
                </div>
              </div>
            </div>
            <div id="commentsList">
              <CommentCard
                v-for="comment in commentStore.all"
                :author="getCommentAuthor(comment.user_id)"
                :text="comment.text"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card shadow-sm border-0 mb-4">
          <div class="card-body pb-1">
            <h5 class="text-danger mb-3">Информация о рецепте</h5>
            <div class="mb-3">
              <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
                <span class="text-muted">Общее время</span>
                <span class="fw-semibold" id="totalTime">{{ recipeStore.recipe.preparation_time }} минут</span>
              </div>
              <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
                <span class="text-muted">Активное время</span>
                <span class="fw-semibold" id="activeTime">{{ recipeStore.recipe.cooking_time }} минут</span>
              </div>
              <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
                <span class="text-muted">Тип блюда</span>
                <span class="fw-semibold" id="dishType">{{ constants.dishTypes[recipeStore.recipe.dish_type] }}</span>
              </div>
              <div class="d-flex justify-content-between align-items-center py-2">
                <span class="text-muted">Сложность</span>
                <span class="fw-semibold" id="difficulty">{{ constants.difficultyLevels[recipeStore.recipe.difficulty_level] }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
