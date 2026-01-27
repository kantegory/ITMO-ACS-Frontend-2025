<template>
  <section class="container my-5">
    <div class="text-center mb-4">
      <h2 class="title">
        Добро пожаловать,
        <span class="username">Злата</span>!
      </h2>
      <p class="text-muted">
        Здесь вы можете управлять своими рецептами и настройками профиля.
      </p>
    </div>

    <ul class="nav nav-tabs justify-content-center" role="tablist">
      <li class="nav-item">
        <button
          class="nav-link active"
          data-bs-toggle="tab"
          data-bs-target="#my-recipes"
        >
          Мои рецепты
        </button>
      </li>

      <li class="nav-item">
        <button
          class="nav-link"
          data-bs-toggle="tab"
          data-bs-target="#saved"
        >
          Сохранённые
        </button>
      </li>

      <li class="nav-item">
        <button
          class="nav-link"
          data-bs-toggle="tab"
          data-bs-target="#settings"
        >
          Настройки профиля
        </button>
      </li>
    </ul>

    <div class="tab-content mt-4">

    <div class="tab-pane fade show active" id="my-recipes">
      <div class="container mt-4">
        <div class="row g-4">

          <div
            v-for="recipe in recipes"
            :key="recipe.id"
            class="col-md-4"
          >
            <RecipeCard :recipe="recipe" />
          </div>

          <p
            v-if="!loading && recipes.length === 0"
            class="text-center text-muted"
          >
            У вас пока нет рецептов
          </p>

        </div>
      </div>
    </div>

    <div class="tab-pane fade" id="saved">
      <div class="container mt-4">
        <div class="row g-4">

          <div
            v-for="recipe in savedRecipes"
            :key="recipe.id"
            class="col-md-4"
          >
            <RecipeCard :recipe="recipe" />
          </div>

          <p
            v-if="!loadingSaved && savedRecipes.length === 0"
            class="text-center text-muted"
          >
            У вас пока нет сохранённых рецептов
          </p>

        </div>
      </div>
    </div>

      <div class="tab-pane fade" id="settings">
        <form class="col-md-6 mx-auto mt-4">
          <div class="mb-3">
            <label class="form-label">Имя пользователя</label>
            <input type="text" class="form-control">
          </div>

          <div class="mb-3">
            <label class="form-label">Электронная почта</label>
            <input type="email" class="form-control">
          </div>

          <div class="mb-3">
            <label class="form-label">Новый пароль</label>
            <input
              type="password"
              class="form-control"
              placeholder="Введите новый пароль"
            >
          </div>

          <button class="btn save-btn w-100 mt-3">
            Сохранить изменения
          </button>

          <p class="mt-3 text-center"></p>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { onMounted } from 'vue'
import { useRecipes } from '@/composable/useAuth'
import RecipeCard from '@/components/RecipeCard.vue'

const currentUser = {
  id: 2,
  name: 'Злата'
}

const { recipes, loading, loadRecipesByAuthor } = useRecipes()

onMounted(() => {
  loadRecipesByAuthor(currentUser.id)
})

import { ref } from 'vue'
import api from '@/api/axios'

const savedRecipes = ref([])
const loadingSaved = ref(false)

const loadSavedRecipes = async () => {
  try {
    loadingSaved.value = true

    const savedIds =
      JSON.parse(localStorage.getItem('savedRecipes')) || []

    if (savedIds.length === 0) {
      savedRecipes.value = []
      return
    }

    const requests = savedIds.map(id =>
      api.get(`/recipes/${id}`)
    )

    const responses = await Promise.all(requests)
    savedRecipes.value = responses.map(r => r.data)

  } catch (e) {
    console.error('Ошибка загрузки сохранённых рецептов', e)
  } finally {
    loadingSaved.value = false
  }
}

onMounted(loadSavedRecipes)
</script>

<style scoped>
.title {
  color: #6b3e26;
}

.username {
  color: #d47b63;
}

.save-btn {
  background-color: #d47b63;
  color: #fff;
  border: none;
}
</style>
