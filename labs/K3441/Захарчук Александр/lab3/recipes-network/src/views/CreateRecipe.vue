<script setup>
import Navbar from "@/components/Navbar.vue";
import FormField from "@/components/FormField.vue";
import FormContainer from "@/components/FormContainer.vue";
import constants from "@/helpers/constants.js";
import { ref, onMounted } from "vue";
import { useRecipeStore } from "@/stores/recipe";

const form = ref({
  title: "",
  description: "",
  picture: "",
  dishType: "soup",
  difficultyLevel: "beginner",
  preparationTime: 30,
  cookingTime: 20,
  ingredients: [],
});

const recipeStore = useRecipeStore();

onMounted(async () => {
  try {
    await recipeStore.load();
    await recipeStore.loadIngredients();
  } catch (error) {
    console.error("Ошибка загрузки рецептов:", error);
  }
});

const ingredientForm = ref({
  ingredientId: 1,
  quantity: 100,
  unit: "g",
});

const addIngredient = () => {
    const ingredientData = {
        ingredient_id: ingredientForm.value.ingredientId,
        quantity: ingredientForm.value.quantity,
        unit: ingredientForm.value.unit,
    };
    form.value.ingredients.push(ingredientData);
};

const removeIngredient = (id) => {
    form.value.ingredients = form.value.ingredients.filter(ingredient => ingredient.ingredient_id !== id)
}

const handleCreateRecipe = async () => {
    const recipeData = {
        title: form.value.title.trim(),
        description: form.value.description.trim(),
        picture: form.value.picture.trim(),
        dish_type: form.value.dishType,
        difficulty_level: form.value.difficultyLevel,
        preparation_time: form.value.preparationTime,
        cooking_time: form.value.cookingTime,
        ingredients: form.value.ingredients,
    }
    await recipeStore.create(recipeData);
};
</script>

<template>
  <Navbar />
  <FormContainer>
    <form @submit.prevent="handleCreateRecipe">
      <FormField
        type="text"
        id="title"
        label="Название блюда"
        placeholder="Введите название"
        isRequired="true"
        v-model="form.title"
      />
      <div class="mb-3">
        <label for="description" class="form-label">Описание</label>
        <textarea
          class="form-control"
          placeholder="Введите описание"
          id="description"
          style="height: 100px"
          required="true"
          v-model="form.description"
        ></textarea>
      </div>
      <FormField
        type="url"
        id="picture"
        label="Фото готового блюда"
        placeholder="Введите ссылку на фото"
        isRequired="true"
        addBottomMargin="true"
        v-model="form.picture"
      />
      <div class="mb-3">
        <label for="dishType" class="form-label">Тип блюда</label>
        <select class="form-select" id="dishType" v-model="form.dishType">
          <option v-for="(label, value) in constants.dishTypes" :value="value" :key="value">
            {{ label }}
          </option>
        </select>
      </div>
      <div class="mb-3">
        <label for="difficultyLevel" class="form-label">Уровень сложности</label>
        <select class="form-select" id="difficultyLevel" v-model="form.difficultyLevel">
          <option v-for="(label, value) in constants.difficultyLevels" :value="value" :key="value">
            {{ label }}
          </option>
        </select>
      </div>
      <div class="mb-3">
        <label for="preparationTime" class="form-label">Время приготовления (минуты)</label>
        <input
          type="number"
          min="1"
          max="999"
          step="1"
          class="form-control"
          id="preparationTime"
          required="true"
          v-model="form.preparationTime"
        />
      </div>
      <div class="mb-3">
        <label for="cookingTime" class="form-label">Время активной готовки (минуты)</label>
        <input
          type="number"
          min="1"
          max="999"
          step="1"
          class="form-control"
          id="cookingTime"
          required="true"
          v-model="form.cookingTime"
        />
      </div>
      <div class="mb-3">
        <p class="form-label">Ингредиенты</p>

        <form @submit.prevent="addIngredient">
          <div class="input-group">
            <select class="form-select" v-model="ingredientForm.ingredientId">
              <option
                v-for="ingredient in recipeStore.ingredients"
                :value="ingredient.id"
                :key="ingredient.id"
              >
                {{ ingredient.name }}
              </option>
            </select>
            <input
              type="number"
              min="0.01"
              max="9999"
              step="0.01"
              class="form-control"
              required="true"
              v-model="ingredientForm.quantity"
            />
            <select class="form-select" v-model="ingredientForm.unit">
              <option v-for="(label, value) in constants.units" :value="value" :key="value">
                {{ label }}
              </option>
            </select>
            <button type="submit" class="btn btn-outline-danger">Добавить</button>
          </div>
        </form>
      </div>

      <ul v-for="ingredient in form.ingredients" class="list-group">
        <li class="list-group-item mb-2 d-flex justify-content-between align-items-center">
          <span>
            <strong>{{ recipeStore.geIngredientById(ingredient.ingredient_id).name }}</strong> -
            {{ ingredient.quantity }} {{ constants.units[ingredient.unit] }}
          </span>
          <button
            @click="removeIngredient(ingredient.ingredient_id)"
            type="button"
            class="btn btn-outline-danger p-2 px-3"
          >
            X
          </button>
        </li>
      </ul>

      <button type="submit" class="btn btn-danger w-100 py-2 mt-3">Создать рецепт</button>
    </form>
  </FormContainer>
</template>
