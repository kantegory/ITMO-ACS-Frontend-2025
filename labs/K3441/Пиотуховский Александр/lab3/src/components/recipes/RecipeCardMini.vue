<template>
  <RouterLink :to="`/recipe/${recipe.id}`" class="recipe-card-mini text-decoration-none">
    <div class="d-flex align-items-center">
      <img
        src="https://placehold.co/80x80/ff6b6b/ffffff?text=Рецепт"
        :alt="recipe.title"
        class="rounded me-3"
      />
      <div>
        <h6 class="mb-1">{{ recipe.title }}</h6>
        <div>
          <span class="badge bg-light text-dark small">{{ recipe.dishType?.title }}</span>
          <span class="badge small ms-1" :class="difficultyBadge.class">{{
              difficultyBadge.text
            }}</span>
        </div>
      </div>
    </div>
  </RouterLink>
</template>

<script setup>
import {computed} from 'vue'
import {RouterLink} from 'vue-router'
import {useFormatters} from '@/composables/useFormatters'

const props = defineProps({
  recipe: {
    type: Object,
    required: true
  },
  author: {
    type: Object,
    default: null
  }
})

const {getDifficultyBadge} = useFormatters()

const difficultyBadge = computed(() => {
  return getDifficultyBadge(props.recipe.difficulty)
})
</script>

<style scoped>
.recipe-card-mini {
  display: block;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid var(--bs-border-color);
  border-radius: 0.5rem;
  transition: border-color 0.3s ease;
}

.recipe-card-mini:hover {
  border-color: var(--primary-color);
}

.recipe-card-mini img {
  width: 80px;
  height: 80px;
  object-fit: cover;
}

.recipe-card-mini h6 {
  color: var(--color-white);
  font-weight: 600;
}
</style>
