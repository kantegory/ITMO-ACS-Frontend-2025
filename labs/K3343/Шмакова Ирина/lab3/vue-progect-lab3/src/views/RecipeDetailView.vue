<template>
  <BaseLayout>
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Загрузка...</span>
      </div>
    </div>
    
    <div v-else-if="recipe" class="recipe-detail">
      <div class="row">
        <div class="col-md-6">
          <img 
            :src="recipe.image || 'https://via.placeholder.com/600x400'" 
            :alt="recipe.title"
            class="img-fluid rounded"
          >
        </div>
        <div class="col-md-6">
          <h1>{{ recipe.title }}</h1>
          <p class="lead">{{ recipe.description }}</p>
          
          <div class="d-flex gap-3 mb-4">
            <span class="badge bg-secondary">{{ getDifficultyText(recipe.difficulty) }}</span>
            <span class="badge bg-success">{{ recipe.category }}</span>
          </div>
          
          <div class="mb-4">
            <h4>Ингредиенты:</h4>
            <ul class="list-group">
              <li 
                v-for="(ingredient, index) in recipe.ingredients" 
                :key="index"
                class="list-group-item"
              >
                {{ ingredient }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="col-lg-6">
            <div class="card">
                <div class="card-header bg-success text-white">
                    <h4 class="mb-0">Инструкции приготовления</h4>
                </div>
                <div class="card-body">
                    <ol class="list-group list-group-numbered">
                        <li 
                            v-for="(step, index) in recipe.instructions" 
                            :key="index"
                            class="list-group-item"
                        >
                            {{ step }}
                        </li>
                    </ol>
                </div>
            </div>
        </div>
      
      <div class="mt-4">
        <router-link to="/" class="btn btn-outline-secondary">
          ← Назад к списку рецептов
        </router-link>
      </div>
    </div>
    
    <div v-else class="alert alert-danger">
      Рецепт не найден
    </div>
  </BaseLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import BaseLayout from '@/layout/BaseLayout.vue'

const route = useRoute()
const recipe = ref(null)
const loading = ref(true)

const getDifficultyText = (difficulty) => {
  const difficulties = {
    easy: 'Легко',
    medium: 'Средне',
    hard: 'Сложно'
  }
  return difficulties[difficulty] || difficulty
}

onMounted(async () => {
  // Здесь будет запрос к API
  // Пока имитируем загрузку
  setTimeout(() => {
    recipe.value = {
      "id": "1",
      "title": "Тыквенный крем-суп",
      "description": "Нежный суп с нотками имбиря и сливками",
      "image": "images/pumpkin-soup.jpg",
      "type": "Обед",
      "difficulty": "Легко",
      "ingredients": [
        "Тыква 500г",
        "Лук 1 шт",
        "Имбирь 20г",
        "Сливки 100мл",
        "Овощной бульон 1л",
        "Соль, перец по вкусу"
      ],
    }
    loading.value = false
  }, 500)
})
</script>
