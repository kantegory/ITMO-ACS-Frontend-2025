<template>
  <div class="card">
    <div class="card-header">
      <h3>Опубликовать новый рецепт</h3>
    </div>
    <div class="card-body">
      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label for="recipeTitleInput" class="form-label">Название рецепта</label>
          <input v-model="title" type="text" class="form-control" id="recipeTitleInput" required>
        </div>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="recipeTypeInput" class="form-label">Тип блюда</label>
            <select v-model="type" class="form-select" id="recipeTypeInput" required>
              <option value="первое">Первое блюдо</option>
              <option value="второе">Второе блюдо</option>
              <option value="десерт">Десерт</option>
              <option value="салат">Салат</option>
              <option value="закуска">Закуска</option>
            </select>
          </div>
          <div class="col-md-6 mb-3">
            <label for="recipeDifficultyInput" class="form-label">Сложность</label>
            <select v-model="difficulty" class="form-select" id="recipeDifficultyInput" required>
              <option value="легкая">Легкая</option>
              <option value="средняя">Средняя</option>
              <option value="сложная">Сложная</option>
            </select>
          </div>
        </div>
        <div class="mb-3">
          <label for="recipeIngredientsInput" class="form-label">Ингредиенты (по одному на строку)</label>
          <textarea v-model="ingredientsText" class="form-control" id="recipeIngredientsInput" rows="3" required></textarea>
        </div>
        <div class="mb-3">
          <label for="recipeInstructionsInput" class="form-label">Шаги приготовления (по одному на строку)</label>
          <textarea v-model="instructionsText" class="form-control" id="recipeInstructionsInput" rows="5" required></textarea>
        </div>
        <div class="mb-3">
          <label for="recipeVideoInput" class="form-label">URL видео (необязательно)</label>
          <input v-model="videoUrl" type="url" class="form-control" id="recipeVideoInput">
        </div>
        <button type="submit" class="btn btn-primary w-100">Опубликовать</button>
      </form>
      <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useApi } from '../composables/useApi'

export default {
  name: 'RecipeForm',
  emits: ['recipe-published'],
  setup(_, { emit }) {
    const title = ref('')
    const type = ref('первое')
    const difficulty = ref('средняя')
    const ingredientsText = ref('')
    const instructionsText = ref('')
    const videoUrl = ref('')
    const error = ref('')
    
    const { publishRecipe } = useApi()
    
    const handleSubmit = async () => {
      try {
        const ingredients = ingredientsText.value.split('\n').filter(i => i.trim())
        const instructions = instructionsText.value.split('\n').filter(i => i.trim())
        
        await publishRecipe({
          title: title.value,
          type: type.value,
          difficulty: difficulty.value,
          description: `Рецепт ${title.value}`,
          ingredients,
          instructions,
          videoUrl: videoUrl.value
        })
        
        // Сброс формы
        title.value = ''
        type.value = 'первое'
        difficulty.value = 'средняя'
        ingredientsText.value = ''
        instructionsText.value = ''
        videoUrl.value = ''
        
        error.value = ''
        emit('recipe-published')
      } catch (err) {
        error.value = err.message
      }
    }
    
    return {
      title,
      type,
      difficulty,
      ingredientsText,
      instructionsText,
      videoUrl,
      error,
      handleSubmit
    }
  }
}
</script>