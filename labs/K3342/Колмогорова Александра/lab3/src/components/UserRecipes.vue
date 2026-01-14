<script setup>
import { ref } from 'vue'

defineProps({
  recipes: Array
})

const emit = defineEmits(['create', 'delete'])

const title = ref('')
const description = ref('')
const type = ref('')
const difficulty = ref('')
const ingredients = ref([])

const allIngredients = [
  { value: 'meat', label: 'Мясо' },
  { value: 'fish', label: 'Рыба' },
  { value: 'veggies', label: 'Овощи' },
  { value: 'poultry', label: 'Птица' },
  { value: 'dairy', label: 'Молочные продукты' },
  { value: 'grains', label: 'Крупы и злаки' },
  { value: 'fruits', label: 'Фрукты' },
  { value: 'seafood', label: 'Морепродукты' },
]

function toggleIngredient(value) {
  if (ingredients.value.includes(value)) {
    ingredients.value = ingredients.value.filter(i => i !== value)
  } else {
    ingredients.value.push(value)
  }
}

function createRecipe() {
  if (!title.value || !description.value || !type.value || !difficulty.value || !ingredients.value.length) {
    alert('Заполните все поля')
    return
  }

  emit('create', {
    id: Date.now(),
    title: title.value,
    description: description.value,
    type: type.value,
    difficulty: difficulty.value,
    ingredients: ingredients.value
  })

  title.value = description.value = type.value = difficulty.value = ''
  ingredients.value = []
}
</script>

<template>
  <div class="text-end mb-3">
    <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#createRecipeModal">Создать новый рецепт</button>
  </div>

  <div class="row">
    <div v-if="!recipes?.length" class="text-muted">У вас пока нет рецептов</div>

    <div v-for="r in recipes" :key="r.id" class="col-md-6 mb-3">
      <div class="border rounded p-3">
        <h6 class="fw-bold">{{ r.title }}</h6>
        <span class="badge bg-secondary me-1">{{ r.type }}</span>
        <span class="badge bg-info">{{ r.difficulty }}</span>

        <div class="text-end mt-2">
          <button class="btn btn-outline-danger btn-sm" @click="emit('delete', r.id)">×</button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="createRecipeModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Создание рецепта</h5>
          <button class="btn-close" data-bs-dismiss="modal"></button>
        </div>

        <div class="modal-body">
            <input v-model="title" class="form-control mb-2" placeholder="Название блюда" />

            <textarea v-model="description" class="form-control mb-2" placeholder="Пошаговая инструкция"></textarea>

            <select v-model="type" class="form-select mb-2">
              <option value=""> </option>
              <option>Завтрак</option>
              <option>Суп</option>
              <option>Салат</option>
              <option>Основное блюдо</option>
              <option>Десерт</option>
              <option>Напиток</option>
            </select>

            <select v-model="difficulty" class="form-select mb-2">
              <option value=""> </option>
              <option>Низкая</option>
              <option>Средняя</option>
              <option>Высокая</option>
            </select>

            <div class="border rounded p-3 mb-2" style="max-height: 200px; overflow-y: auto;">
              <label class="form-label">Основные ингредиенты</label>
              <div v-for="ingredient in allIngredients" :key="ingredient.value" class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :value="ingredient.value"
                  :id="ingredient.value"
                  @change="toggleIngredient(ingredient.value)"
                  :checked="ingredients.includes(ingredient.value)"
                />
                <label class="form-check-label" :for="ingredient.value">{{ ingredient.label }}</label>
              </div>
              <small class="text-muted">Выберите один или несколько ингредиентов</small>
            </div>
          </div>

          <div class="modal-footer"> 
            <button class="btn btn-success" data-bs-dismiss="modal" @click="createRecipe()">Создать</button> 
          </div>
        </div>
      </div>
    </div>
</template>