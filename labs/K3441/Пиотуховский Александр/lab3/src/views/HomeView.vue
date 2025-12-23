<template>
  <main id="main-content">
    <section class="hero-section" aria-labelledby="hero-heading">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-8 mx-auto text-center">
            <h1 id="hero-heading" class="display-4 fw-bold mb-3">
              Делитесь своими кулинарными шедеврами
            </h1>
            <p class="lead mb-4">
              Присоединяйтесь к сообществу любителей готовки. Публикуйте рецепты, находите
              вдохновение и общайтесь с единомышленниками
            </p>
            <div class="d-flex gap-3 justify-content-center">
              <RouterLink to="/search" class="btn btn-primary btn-lg">Найти рецепт</RouterLink>
              <RouterLink
                v-if="!authStore.isLoggedIn"
                to="/register"
                class="btn btn-outline-primary btn-lg"
              >
                Зарегистрироваться
              </RouterLink>
              <RouterLink
                v-else
                :to="`/recipe/${firstRecipeId}`"
                class="btn btn-outline-primary btn-lg"
              >
                Добавить рецепт
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="recipes-section" aria-labelledby="recipes-heading">
      <div class="container">
        <h2 id="recipes-heading" class="text-center fw-bold mb-5">Популярные рецепты</h2>

        <div v-if="loading" class="loading-spinner">
          <div class="spinner"></div>
        </div>

        <div v-else-if="error" class="alert alert-danger">
          {{ error }}
        </div>

        <div v-else class="recipes-grid">
          <RecipeCard
            v-for="recipe in recipes"
            :key="recipe.id"
            :recipe="recipe"
            :author="getAuthor(recipe.authorId)"
          />
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {RouterLink} from 'vue-router'
import RecipeCard from '@/components/recipes/RecipeCard.vue'
import {useApi} from '@/composables/useApi'
import {useAuthStore} from '@/stores/auth'

const api = useApi()
const authStore = useAuthStore()
const recipes = ref([])
const users = ref([])
const loading = ref(true)
const error = ref(null)

const firstRecipeId = computed(() => {
  return recipes.value.length > 0 ? recipes.value[0].id : 1
})

const getAuthor = (authorId) => {
  return users.value.find((u) => u.id === authorId)
}

onMounted(async () => {
  try {
    const [recipesRes, usersRes] = await Promise.all([
      api.getRecipes().catch(() => ({data: []})),
      api.getUsers().catch(() => ({data: []}))
    ])

    recipes.value = recipesRes.data.slice(0, 12)
    users.value = usersRes.data
  } catch (err) {
    error.value = 'Не удалось загрузить рецепты'
  } finally {
    loading.value = false
  }
})
</script>
