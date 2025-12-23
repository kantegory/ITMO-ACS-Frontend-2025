<template>
  <article class="recipe-card" role="listitem">
    <div class="recipe-image">
      <img
        :src="`https://placehold.co/350x250/ff6b6b/ffffff?text=${encodeURIComponent(recipe.title.substring(0, 20))}`"
        :alt="`Фото рецепта: ${recipe.title}`"
      />
      <button
        class="btn-favorite"
        :class="{ active: isFavorite }"
        @click.prevent="toggleFavorite"
        :aria-label="isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'"
        :aria-pressed="isFavorite"
      >
        <svg class="icon" aria-hidden="true" width="20" height="20">
          <use
            :href="`/src/assets/images/icons-sprite.svg#${isFavorite ? 'icon-heart-fill' : 'icon-heart'}`"></use>
        </svg>
      </button>
    </div>

    <div class="recipe-body">
      <div class="recipe-tags mb-2" role="group" aria-label="Категории рецепта">
        <span class="badge bg-light text-dark">{{ recipe.dishType?.title || 'Блюдо' }}</span>
        <span class="badge" :class="difficultyBadge.class">{{ difficultyBadge.text }}</span>
      </div>

      <h5 class="recipe-title">
        <RouterLink :to="`/recipe/${recipe.id}`">{{ recipe.title }}</RouterLink>
      </h5>

      <p class="recipe-description">{{ recipe.description || '' }}</p>

      <div class="recipe-footer">
        <div class="recipe-author">
          <img
            :src="author?.photoUrl || 'https://placehold.co/32x32/999/fff?text=?'"
            :alt="`Фото автора: ${authorName}`"
          />
          <span>{{ authorName }}</span>
        </div>

        <div class="recipe-stats" role="group" aria-label="Статистика рецепта">
          <span class="me-3" :aria-label="`${likes} лайков`">
            <svg class="icon text-danger" aria-hidden="true" width="16" height="16">
              <use href="/src/assets/images/icons-sprite.svg#icon-heart-fill"></use>
            </svg>
            {{ likes }}
          </span>
          <span :aria-label="`${comments} комментариев`">
            <svg class="icon text-primary" aria-hidden="true" width="16" height="16">
              <use href="/src/assets/images/icons-sprite.svg#icon-chat-dots"></use>
            </svg>
            {{ comments }}
          </span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import {computed, ref} from 'vue'
import {RouterLink} from 'vue-router'
import {useFormatters} from '@/composables/useFormatters'

const props = defineProps({
  recipe: {type: Object, required: true},
  author: {type: Object, default: null}
})

const {getDifficultyBadge} = useFormatters()

const isFavorite = ref(false)
const likes = ref(Math.floor(Math.random() * 500 + 100))
const comments = ref(Math.floor(Math.random() * 100 + 10))

const authorName = computed(() => {
  if (!props.author) return 'Пользователь'
  return `${props.author.firstName || ''} ${props.author.lastName || ''}`.trim() || 'Пользователь'
})

const difficultyBadge = computed(() => getDifficultyBadge(props.recipe.difficulty))

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
}
</script>

<style scoped>
.btn-favorite .icon {
  color: var(--color-primary);
  fill: var(--color-primary);
  stroke: none;
}

.btn-favorite.active .icon,
.btn-favorite[aria-pressed="true"] .icon {
  fill: none;
  stroke: var(--color-primary);
  stroke-width: 1.5;
}

.recipe-stats span {
  white-space: nowrap;
}
</style>
