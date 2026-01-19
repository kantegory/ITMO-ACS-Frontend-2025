<template>
  <div class="card shadow-sm h-100" style="cursor:pointer;">
    <img
      v-if="img"
      :src="img"
      class="card-img-top object-fit-cover"
      :alt="title"
      style="height: 200px; width: 100%;"
    />

    <div class="card-body">
      <h5 class="card-title">{{ title }}</h5>

      <p v-if="desc" class="card-text small text-muted">
        {{ desc }}
      </p>

      <p v-if="ingredientsText">
        <strong>Ингредиенты:</strong> {{ ingredientsText }}
      </p>

      <p v-if="categoryText">
        <strong>Категория:</strong> {{ categoryText }}
      </p>

      <p v-if="areaText">
        <strong>Кухня:</strong> {{ areaText }}
      </p>

      <p v-if="authorText">
        <strong>Автор:</strong> {{ authorText }}
      </p>

      <div v-if="likes != null" class="d-flex align-items-center gap-3">
        <p class="d-inline mb-0">{{ likes }}</p>
        <svg class="svg-icon fill icon-heart" aria-hidden="true">
          <use href="../../sprite.svg#icon-heart"></use>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue"
import { useMealdbProxyActions } from "@/composables/useMealdbProxyActions"

const props = defineProps({
  recipe: { type: Object, required: true }
})

const title = computed(() => {
  return (
    props.recipe?.strMeal ??
    props.recipe?.name ??
    "Без названия"
  )
})

const img = computed(() => {
  return (
    props.recipe?.strMealThumb ??
    props.recipe?.photo ??
    ""
  )
})

const desc = computed(() => {
  const t =
    props.recipe?.strInstructions ??
    props.recipe?.text ??
    ""
  return String(t).trim().slice(0, 160)
})

function mealdbIngredients(r) {
  const out = []
  for (let i = 1; i <= 20; i++) {
    const v = r?.[`strIngredient${i}`]
    const s = String(v ?? "").trim()
    if (s) out.push(s)
  }
  return out
}

const ingredientsArr = computed(() => {
  if (Array.isArray(props.recipe?.ingredients)) return props.recipe.ingredients.filter(Boolean)
  return mealdbIngredients(props.recipe)
})

const ingredientsText = computed(() => {
  return ingredientsArr.value.length ? ingredientsArr.value.join(", ") : ""
})

const categoryText = computed(() => {
  return (
    props.recipe?.strCategory ??
    props.recipe?.category ??
    ""
  )
})

const areaText = computed(() => {
  return (
    props.recipe?.strArea ??
    props.recipe?.area ??
    ""
  )
})

const authorText = computed(() => {
  return props.recipe?.author ?? "TheMealDB"
})


const isMealdb = computed(() => Boolean(props.recipe?.idMeal))

const {
  likes,
  loadProxyIfExists,
} = useMealdbProxyActions(computed(() => props.recipe))

onMounted(() => {
  if (isMealdb.value) loadProxyIfExists()
})

</script>
