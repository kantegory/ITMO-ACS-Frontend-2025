<template>
  <AppNavbar />

  <div class="container mt-4">
    <h1>Поиск рецептов</h1>

    <div class="row">
      <!-- Левая колонка: фильтры -->
      <div class="col-md-3">
        <div class="card">
          <div class="card-body">
            <h5>Фильтры</h5>

            <input
              type="text"
              v-model="searchText"
              class="form-control mb-3"
              placeholder="введите слово..."
              @keyup.enter="applyFilters"
            >

            <label class="form-label">Сложность</label>
            <select v-model="difficulty" class="form-select mb-3">
              <option value="">любая</option>
              <option value="Легко">Легко</option>
              <option value="Средне">Средне</option>
              <option value="Сложно">Сложно</option>
            </select>

            <button @click="applyFilters" class="btn btn-primary w-100">
              Показать
            </button>
          </div>
        </div>
      </div>

      <!-- Правая колонка: результаты -->
      <div class="col-md-9">
        <div class="row" v-if="filteredRecipes.length > 0">
          <RecipeCard v-for="recipe in filteredRecipes" :key="recipe.id" :recipe="recipe" />
        </div>

        <div v-else class="text-center my-5">
          <p v-if="loading">Загрузка...</p>
          <p v-else>Ничего не найдено</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppNavbar from '@/components/AppNavbar.vue'
import RecipeCard from '@/components/RecipeCard.vue'
import { useApi } from '@/composables/useApi.js'

const { getRecipes } = useApi()

const allRecipes = ref([])         // все рецепты с сервера
const filteredRecipes = ref([])    // отфильтрованные
const searchText = ref('')
const difficulty = ref('')
const loading = ref(true)

const applyFilters = () => {
  let text = searchText.value.toLowerCase().trim()

  filteredRecipes.value = allRecipes.value.filter(r => {
    let good = true

    // Фильтр по тексту
    if (text !== '' && 
        r.title.toLowerCase().indexOf(text) === -1 && 
        (!r.short || r.short.toLowerCase().indexOf(text) === -1)) {
      good = false
    }

    // Фильтр по сложности
    if (difficulty.value !== '' && r.difficulty !== difficulty.value) {
      good = false
    }

    return good
  })
}

onMounted(async () => {
  loading.value = true
  allRecipes.value = await getRecipes()
  applyFilters()  // показываем все сразу
  loading.value = false
})
</script>