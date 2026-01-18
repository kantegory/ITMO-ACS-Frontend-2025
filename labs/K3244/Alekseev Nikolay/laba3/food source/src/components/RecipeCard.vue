<template>
  <div class="card shadow-sm h-100">
    <img
      :src="recipe.photo"
      class="card-img-top object-fit-cover"
      :alt="recipe.name"
      style="height: 200px; width: 100%;"
    />
    <div class="card-body">
      <h5 class="card-title">{{ recipe.name }}</h5>
      <p class="card-text small text-muted">{{ recipe.text }}</p>
      <p class="mb-1"><strong>Сложность:</strong> {{ difficultyLabel }}</p>
      <p class="mb-1"><strong>Тип:</strong> {{ typeLabel }}</p>
      <p class="mb-0"><strong>Автор:</strong> {{ recipe.author }}</p>

      <div class="d-flex align-items-center gap-3">
        <p class="d-inline mb-0">{{ recipe.likes }}</p>
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

const DIFF = ["Легко", "Средне", "Сложно"]
const TYPE = ["Завтрак", "Обед", "Ужин", "Десерт", "Напиток"]

const difficultyLabel = computed(() => {
  const i = (props.recipe?.difficulty || 1) - 1
  return DIFF[i] || "—"
})

const typeLabel = computed(() => {
  const i = (props.recipe?.type || 1) - 1
  return TYPE[i] || "—"
})
</script>
