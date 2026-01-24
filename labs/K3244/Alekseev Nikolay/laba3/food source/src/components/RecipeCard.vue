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

      <div class="d-flex align-items-center gap-3">
        <p class="d-inline mb-0">{{ likes }}</p>
        <svg class="svg-icon fill icon-heart" aria-hidden="true">
          <use href="../../sprite.svg#icon-heart"></use>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  recipe: { type: Object, required: true }
})

const title = computed(() => String(props.recipe?.name || "Без названия"))

const img = computed(() => String(props.recipe?.photo || ""))

const desc = computed(() => {
  const t = String(props.recipe?.text || "").trim()
  return t ? t.slice(0, 160) : ""
})

const ingredientsArr = computed(() =>
  Array.isArray(props.recipe?.ingredients) ? props.recipe.ingredients.filter(Boolean) : []
)

const ingredientsText = computed(() =>
  ingredientsArr.value.length ? ingredientsArr.value.join(", ") : ""
)

const categoryText = computed(() => String(props.recipe?.category || ""))

const areaText = computed(() => String(props.recipe?.area || ""))

const authorText = computed(() => String(props.recipe?.author || ""))

const likes = computed(() => Number(props.recipe?.likes || 0))
</script>
