<template>
  <BaseLayout>
    <header class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h4 m-0">Food Source</h1>

      <div class="d-flex gap-2">
        <router-link class="btn btn-outline-primary d-inline-flex align-items-center gap-2" to="/profile">
          <svg class="svg-icon fill" aria-hidden="true">
            <use href="../../sprite.svg#icon-user"></use>
          </svg>
          <span>Профиль</span>
        </router-link>
      </div>
    </header>

    <div class="row g-3 mb-3">
      <div class="col-md-6">
        <input v-model="query" class="form-control" placeholder="Поиск по названию" />
      </div>

      <div class="col-md-2">
      <select v-model="category" class="form-select">
        <option value="any">Любая категория</option>
        <option
          v-for="c in filters.categories"
          :key="c.idCategory"
          :value="c.strCategory"
        >
          {{ c.strCategory }}
        </option>
      </select>
    </div>

    <div class="col-md-2">
      <select v-model="area" class="form-select">
        <option value="any">Любая кухня</option>
        <option
          v-for="a in filters.areas"
          :key="a"
          :value="a"
        >
          {{ a }}
        </option>
      </select>
    </div>


      <div class="d-flex flex-column align-items-center col-md-2">
        <p class="w-50">Ингредиенты</p>

        <div
          id="ingredientsContainer"
          class="d-flex flex-wrap gap-2 justify-content-center p-2 ingredients-filter"
          :class="{ collapsed: ingredientsCollapsed }"
        >
          <label
            v-for="ing in ingredients"
            :key="ing"
            class="form-check form-check-inline border rounded px-2 py-1 user-select-none"
            style="cursor:pointer;"
          >
            <input
              type="checkbox"
              class="me-3"
              style="cursor:pointer;"
              :value="ing"
              :checked="selectedIngredients.includes(ing)"
              @change="onIngredientToggle(ing, $event.target.checked)"
            />
            <span>{{ ing }}</span>
          </label>
        </div>

        <button
          v-if="ingredients.length > 3"
          id="ingredientsToggle"
          type="button"
          class="mt-2"
          @click="ingredientsCollapsed = !ingredientsCollapsed"
        >
          {{ ingredientsCollapsed ? "Показать ещё" : "Скрыть" }}
        </button>
      </div>
    </div>

    <div v-if="store.loading" class="text-muted">Загрузка...</div>

    <p v-else-if="store.list.length === 0" class="text-muted text-center">
      Ничего не найдено
    </p>

    <div v-else class="row g-3">
      <div class="col-md-4" v-for="r in store.list" :key="r.idMeal">
        <router-link class="text-decoration-none text-dark" :to="`/recipe/${r.idMeal}`">
          <RecipeCard :recipe="r" />
        </router-link>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue"
import BaseLayout from "@/components/BaseLayout.vue"
import RecipeCard from "@/components/RecipeCard.vue"
import { useMealdbFiltersStore } from "@/stores/mealDBFilters"
import { useMealsStore } from "@/stores/meals"

const filters = useMealdbFiltersStore()
const store = useMealsStore()

const query = ref("")
const category = ref("any")  // было type
const area = ref("any")      // вместо difficulty
const ingredientsCollapsed = ref(true)
const selectedIngredients = ref([])

const ingredients = computed(() => filters.ingredients)

function onIngredientToggle(ing, checked) {
  const set = new Set(selectedIngredients.value)
  checked ? set.add(ing) : set.delete(ing)
  selectedIngredients.value = Array.from(set)
}

function buildParams() {
  return {
    q: query.value.trim() || "",
    category: category.value === "any" ? "" : category.value,
    area: area.value === "any" ? "" : area.value,
    ingredients: selectedIngredients.value
  }
}

let timer = null
function request() {
  clearTimeout(timer)
  timer = setTimeout(() => {
    store.loadFiltered(buildParams())
  }, 250)
}

onMounted(async () => {
  await filters.loadAll()

  await store.loadFiltered(buildParams())
})

watch([query, category, area, selectedIngredients], request, { deep: true })


</script>
