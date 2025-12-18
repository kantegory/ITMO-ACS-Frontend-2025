<template>
  <section class="container my-5" v-if="!loading && recipe">
    <div class="row">
      <div class="col-lg-6 mb-4">
        <img
          :src="recipe.image"
          class="img-fluid rounded"
          :alt="recipe.title"
        />
      </div>

      <div class="col-lg-6">
        <h2 style="color:#6b3e26;">{{ recipe.title }}</h2>

        <p class="text-muted">
          Автор:
          <span style="color:#d47b63;">
            {{ author?.name }}
          </span>
        </p>

        <div class="d-flex flex-wrap mb-3">
          <span class="badge bg-secondary me-2">⏱ {{ recipe.time }}</span>
          <span class="badge bg-secondary me-2">
            🍫 {{ recipe.difficulty }}
          </span>
          <span class="badge bg-secondary">
            🎂 {{ recipe.type }}
          </span>
        </div>

        <p>{{ recipe.description }}</p>

      <button class="btn save-btn mt-2" style="background-color:#d47b63; color:#fff; border:none;" @click="toggleSaveRecipe">
        {{ isSaved ? '💔 Убрать из сохранённых' : '💖 Сохранить' }}
      </button>
      </div>
    </div>

    <div class="row mt-5">
      <div class="col-md-4">
        <h4 style="color:#6b3e26;">Ингредиенты</h4>
        <ul class="list-group list-group-flush">
          <li
            v-for="(item, index) in recipe.ingredients"
            :key="index"
            class="list-group-item"
          >
            {{ item }}
          </li>
        </ul>
      </div>

      <div class="col-md-8">
        <h4 style="color:#6b3e26;">Пошаговый рецепт</h4>
        <ol class="list-group list-group-numbered list-group-flush">
          <li
            v-for="(step, index) in recipe.steps"
            :key="index"
            class="list-group-item"
          >
            {{ step }}
          </li>
        </ol>
      </div>
    </div>
  </section>

  <p v-else-if="loading" class="text-center mt-5">
    Загрузка рецепта...
  </p>

  <p v-else class="text-center mt-5">
    Рецепт не найден
  </p>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api/axios'

const props = defineProps({
  id: String
})

onMounted(async () => {
  const response = await fetch(`http://localhost:3000/recipes/${props.id}`)
  const recipe = await response.json()
  console.log(recipe)
})

const route = useRoute()
const recipeId = route.params.id

const recipe = ref(null)
const author = ref(null)
const loading = ref(true)

const loadRecipe = async () => {
  try {
    const recipeResponse = await api.get(`/recipes/${recipeId}`)
    recipe.value = recipeResponse.data

    const userResponse = await api.get(`/users/${recipe.value.author}`)
    author.value = userResponse.data

    document.title = `${recipe.value.title} — Лакомка`
  } catch (e) {
    console.error('Ошибка загрузки рецепта', e)
  } finally {
    loading.value = false
  }
}

onMounted(loadRecipe)

const r_Id = Number(route.params.id)

const isSaved = ref(false)

const checkSaved = () => {
  const saved =
    JSON.parse(localStorage.getItem('savedRecipes')) || []
  isSaved.value = saved.includes(r_Id)
}

const toggleSaveRecipe = () => {
  const saved =
    JSON.parse(localStorage.getItem('savedRecipes')) || []

  if (saved.includes(r_Id)) {
    const updated = saved.filter(id => id !== r_Id)
    localStorage.setItem('savedRecipes', JSON.stringify(updated))
    isSaved.value = false
  } else {
    saved.push(r_Id)
    localStorage.setItem('savedRecipes', JSON.stringify(saved))
    isSaved.value = true
  }
}

onMounted(checkSaved)

</script>
