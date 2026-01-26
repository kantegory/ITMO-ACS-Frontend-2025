<template>
  <AppNavbar />

  <div class="container mt-4">
    <div v-if="recipe">
      <h1>{{ recipe.title || 'Без названия' }}</h1>
      <p v-if="recipe.short" class="text-muted">{{ recipe.short }}</p>

      <img
        :src="normalizedImage"
        class="img-fluid rounded mb-4"
        :alt="recipe.title || ''"
        @error="fallbackImage"
      >

      <div class="row">
        <div class="col-lg-8">
          <h4>Ингредиенты</h4>
          <ul v-if="filteredIngredients.length > 0" class="list-group mb-4">
            <li v-for="ing in filteredIngredients" :key="ing" class="list-group-item">
              {{ ing }}
            </li>
          </ul>
          <p v-else class="text-muted">Ингредиенты не указаны</p>

          <h4>Шаги приготовления</h4>
          <ol v-if="filteredSteps.length > 0" class="list-group list-group-numbered mb-4">
            <li v-for="step in filteredSteps" :key="step" class="list-group-item">
              {{ step }}
            </li>
          </ol>
          <p v-else class="text-muted">Шаги не указаны</p>
        </div>

        <div class="col-lg-4">
          <div class="card">
            <div class="card-body">
              <p><strong>Время:</strong> {{ recipe.time || '—' }} минут</p>
              <p><strong>Сложность:</strong> {{ recipe.difficulty || '—' }}</p>
              <p v-if="recipe.author"><strong>Автор:</strong> {{ recipe.author }}</p>
              <p v-if="recipe.published"><strong>Опубликовано:</strong> {{ recipe.published }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="loading" class="text-center my-5">
      <p>Загрузка рецепта...</p>
    </div>

    <div v-else class="alert alert-danger">
      Рецепт не найден
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppNavbar from '@/components/AppNavbar.vue'
import { useApi } from '@/composables/useApi.js'

const route = useRoute()
const { getRecipeById } = useApi()

const recipe = ref(null)
const loading = ref(true)

// Добавляем ведущий / к пути картинки (из db.json пути без /)
const normalizedImage = computed(() => {
  if (!recipe.value) return '/assets/img/example.jpg'
  return recipe.value.image ? `/${recipe.value.image}` : '/assets/img/example.jpg'
})

const fallbackImage = (event) => {
  event.target.src = '/assets/img/example.jpg'
}

// Фильтруем пустые строки и пробелы
const filteredIngredients = computed(() => {
  if (!recipe.value || !recipe.value.ingredients) return []
  return recipe.value.ingredients.map(i => i.trim()).filter(i => i !== '')
})

const filteredSteps = computed(() => {
  if (!recipe.value || !recipe.value.steps) return []
  return recipe.value.steps.map(s => s.trim()).filter(s => s !== '')
})

onMounted(async () => {
  const id = route.params.id
  if (id) {
    loading.value = true
    recipe.value = await getRecipeById(id)
    loading.value = false
  }
})
</script>