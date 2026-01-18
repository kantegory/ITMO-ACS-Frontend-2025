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
        <select v-model="type" class="form-select">
          <option value="any">Любой</option>
          <option value="1">Завтрак</option>
          <option value="2">Обед</option>
          <option value="3">Ужин</option>
          <option value="4">Десерт</option>
          <option value="5">Напиток</option>
        </select>
      </div>

      <div class="col-md-2">
        <select v-model="difficulty" class="form-select">
          <option value="any">Любая</option>
          <option value="1">Легко</option>
          <option value="2">Средне</option>
          <option value="3">Сложно</option>
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
          @click="$emit('toggleIngredients')"
        >
          {{ ingredientsCollapsed ? "Показать ещё" : "Скрыть" }}
        </button>
      </div>
    </div>



    <div v-if="store.loading" class="text-muted">Загрузка...</div>

    <p v-else-if="filtered.length === 0" class="text-muted text-center">
      Ничего не найдено
    </p>

    <div v-else class="row g-3">
      <div class="col-md-4" v-for="r in filtered" :key="r.id">
        <router-link class="text-decoration-none text-dark" :to="`/recipe/${r.id}`">
          <RecipeCard :recipe="r" />
        </router-link>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import BaseLayout from "@/components/BaseLayout.vue"
import RecipeCard from "@/components/RecipeCard.vue"
import { useRecipesStore } from "@/stores/recipes"

const store = useRecipesStore()

const query = ref("")
const type = ref("any")
const difficulty = ref("any")

const ingredientsCollapsed = ref(true)
const selectedIngredients = ref([])

const ingredients = computed(() => {
  const set = new Set()
  for (const r of store.list) {
    const arr = Array.isArray(r.ingredients) ? r.ingredients : []
    for (const ing of arr) {
      const s = String(ing || "").trim()
      if (s) set.add(s)
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, "ru"))
})

function onIngredientToggle(ing, checked) {
  const set = new Set(selectedIngredients.value)
  if (checked) set.add(ing)
  else set.delete(ing)
  selectedIngredients.value = Array.from(set)
}

const filtered = computed(() => {
  let list = [...store.list]

  const q = query.value.trim().toLowerCase()
  if (q) list = list.filter(r => (r.name || "").toLowerCase().includes(q))

  if (type.value !== "any") list = list.filter(r => String(r.type) === String(type.value))
  if (difficulty.value !== "any") list = list.filter(r => String(r.difficulty) === String(difficulty.value))

  if (selectedIngredients.value.length) {
    const need = selectedIngredients.value.map(s => String(s).toLowerCase())
    list = list.filter(r => {
      const have = (Array.isArray(r.ingredients) ? r.ingredients : []).map(x => String(x).toLowerCase())
      return need.every(n => have.includes(n))
    })
  }

  return list
})


onMounted(async () => {
  await store.load()
})

</script>
