<template>
  <div>
    <h2 class="mb-4">Все рецепты</h2>
    
    <!-- Фильтры -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row">
          <div class="col-md-3 mb-2">
            <label for="typeFilter" class="form-label">Тип блюда</label>
            <select v-model="typeFilter" class="form-select" id="typeFilter">
              <option value="">Все</option>
              <option value="первое">Первое блюдо</option>
              <option value="второе">Второе блюдо</option>
              <option value="десерт">Десерт</option>
              <option value="салат">Салат</option>
            </select>
          </div>
          <div class="col-md-3 mb-2">
            <label for="difficultyFilter" class="form-label">Сложность</label>
            <select v-model="difficultyFilter" class="form-select" id="difficultyFilter">
              <option value="">Все</option>
              <option value="легкая">Легкая</option>
              <option value="средняя">Средняя</option>
              <option value="сложная">Сложная</option>
            </select>
          </div>
          <div class="col-md-4 mb-2">
            <label for="ingredientSearch" class="form-label">Поиск по ингредиентам</label>
            <input v-model="ingredientSearch" type="text" class="form-control" id="ingredientSearch" placeholder="Введите ингредиент...">
          </div>
          <div class="col-md-2 mb-2 d-flex align-items-end">
            <button class="btn btn-primary w-100" @click="applyFilters">Фильтровать</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Список рецептов -->
    <RecipeList v-if="filteredRecipes.length > 0" :recipes="filteredRecipes" />
    <div v-else class="alert alert-info">Рецептов не найдено</div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useApi } from '../composables/useApi'
import RecipeList from '../components/RecipeList.vue'

export default {
  name: 'RecipesView',
  components: {
    RecipeList
  },
  setup() {
    const recipes = ref([])
    const typeFilter = ref('')
    const difficultyFilter = ref('')
    const ingredientSearch = ref('')
    
    const { getRecipes } = useApi()
    
    const loadRecipes = async () => {
      try {
        recipes.value = await getRecipes()
      } catch (error) {
        console.error('Ошибка загрузки рецептов:', error.message)
      }
    }
    
    const filteredRecipes = computed(() => {
      let result = [...recipes.value]
      
      if (typeFilter.value) {
        result = result.filter(recipe => recipe.type === typeFilter.value)
      }
      
      if (difficultyFilter.value) {
        result = result.filter(recipe => recipe.difficulty === difficultyFilter.value)
      }
      
      if (ingredientSearch.value) {
        const searchLower = ingredientSearch.value.toLowerCase()
        result = result.filter(recipe => 
          recipe.ingredients.some(ing => ing.toLowerCase().includes(searchLower))
        )
      }
      
      return result
    })
    
    const applyFilters = () => {
      // Фильтрация происходит автоматически через computed
    }
    
    onMounted(loadRecipes)
    
    return {
      recipes,
      typeFilter,
      difficultyFilter,
      ingredientSearch,
      filteredRecipes,
      applyFilters
    }
  }
}
</script>