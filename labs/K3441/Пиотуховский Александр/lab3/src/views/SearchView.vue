<template>
  <main id="main-content">
    <section class="search-section py-4">
      <div class="container">
        <h1 class="h3 mb-4">Поиск рецептов</h1>

        <div class="row">
          <div class="col-lg-3 mb-4">
            <aside class="filters-sidebar">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="fw-bold mb-0 h4">Фильтры</h2>
                <button class="btn btn-sm btn-outline-secondary" @click="resetFilters">
                  Сбросить
                </button>
              </div>

              <div class="mb-3">
                <label for="searchQuery" class="form-label">Поиск</label>
                <input
                  type="text"
                  class="form-control"
                  id="searchQuery"
                  v-model="searchQuery"
                  placeholder="Название рецепта..."
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Тип блюда</label>
                <select
                  class="form-select"
                  v-model="selectedDishType"
                >
                  <option value="">Все типы</option>
                  <option
                    v-for="type in dishTypes"
                    :key="type.id"
                    :value="type.id"
                  >
                    {{ type.title }}
                  </option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label">Сложность</label>
                <select
                  class="form-select"
                  v-model="selectedDifficulty"
                >
                  <option value="">Любая</option>
                  <option value="1">Легко</option>
                  <option value="2">Средне</option>
                  <option value="3">Сложно</option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label">Ингредиенты</label>
                <div class="ingredient-filters">
                  <div
                    v-for="ingredient in ingredients"
                    :key="ingredient.id"
                    class="form-check"
                  >
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :id="`ingredient-${ingredient.id}`"
                      :value="ingredient.id"
                      v-model="selectedIngredients"
                    />
                    <label
                      class="form-check-label"
                      :for="`ingredient-${ingredient.id}`"
                    >
                      {{ ingredient.name }}
                    </label>
                  </div>
                </div>
              </div>

            </aside>
          </div>

          <div class="col-lg-9">
            <div v-if="loading" class="loading-spinner">
              <div class="spinner"></div>
            </div>

            <div v-else-if="error" class="alert alert-danger">
              {{ error }}
            </div>

            <div v-else-if="recipes.length === 0" class="text-center py-5">
              <p class="text-muted">Рецепты не найдены</p>
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
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import {ref, watch, onMounted} from 'vue'
import RecipeCard from '@/components/recipes/RecipeCard.vue'
import {useApi} from '@/composables/useApi'

const api = useApi()

const recipes = ref([])
const users = ref([])
const dishTypes = ref([])
const ingredients = ref([])
const loading = ref(true)
const error = ref(null)

const searchQuery = ref('')
const selectedDishType = ref('')
const selectedDifficulty = ref('')
const selectedIngredients = ref([])

const getAuthor = (authorId) => {
  return users.value.find((u) => u.id === authorId)
}

const loadRecipes = async () => {
  loading.value = true
  error.value = null

  try {
    const filters = {}

    if (searchQuery.value) {
      filters.title = searchQuery.value
    }

    if (selectedDishType.value) {
      filters.dishtype = selectedDishType.value
    }

    if (selectedDifficulty.value) {
      filters.difficulty = parseInt(selectedDifficulty.value)
    }

    if (selectedIngredients.value.length > 0) {
      filters.ingredients = selectedIngredients.value
    }

    const recipesRes = await api.getRecipes(filters)
    recipes.value = recipesRes.data
  } catch (err) {
    error.value = 'Не удалось загрузить рецепты'
    console.error('Error loading recipes:', err)
  } finally {
    loading.value = false
  }
}

let searchTimeout = null
watch(searchQuery, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadRecipes()
  }, 500)
})

watch([selectedDishType, selectedDifficulty, selectedIngredients], () => {
  loadRecipes()
}, {deep: true})

const resetFilters = () => {
  searchQuery.value = ''
  selectedDishType.value = ''
  selectedDifficulty.value = ''
  selectedIngredients.value = []
}

onMounted(async () => {
  try {
    const [usersRes, dishTypesRes, ingredientsRes] = await Promise.all([
      api.getUsers().catch(() => ({data: []})),
      api.getDishTypes().catch(() => ({data: []})),
      api.getIngredients().catch(() => ({data: []}))
    ])

    users.value = usersRes.data
    ingredients.value = ingredientsRes.data

    if (dishTypesRes.data && dishTypesRes.data.length > 0) {
      dishTypes.value = dishTypesRes.data
    }

    await loadRecipes()
  } catch (err) {
    error.value = 'Не удалось загрузить данные'
  }
})
</script>

<style scoped>
.ingredient-filters {
  max-height: 200px;
  overflow-y: auto;
}
</style>
