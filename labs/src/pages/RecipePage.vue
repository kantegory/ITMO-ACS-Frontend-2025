<template>
  <div>
    <div v-if="loading">Загрузка рецепта...</div>
    <div v-else-if="error">Ошибка загрузки рецепта</div>

    <div v-else-if="recipe">
      <h1 class="mb-3">{{ recipe.title }}</h1>

      <img
        :src="imageSrc"
        class="img-fluid mb-4"
        alt="Recipe image"
      />

      <p class="lead">
        {{ recipe.description || 'Описание отсутствует' }}
      </p>

      <RouterLink to="/" class="btn btn-outline-secondary mt-3">
        ← Назад
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const recipe = ref(null)
const loading = ref(false)
const error = ref(null)

const API_URL = 'http://localhost:3000/recipes'

const imageSrc = computed(() => {
  return (
    recipe.value?.image ||
    recipe.value?.images?.[0] ||
    'https://via.placeholder.com/600x400?text=Recipe'
  )
})

onMounted(async () => {
  loading.value = true
  try {
    const response = await axios.get(`${API_URL}/${route.params.id}`)
    recipe.value = response.data
  } catch (err) {
    error.value = err
  } finally {
    loading.value = false
  }
})
</script>
