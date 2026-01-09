<template>
  <div class="post-card mb-4">
    <div class="post-header">
      <div class="d-flex align-items-center mb-3">
        <img
          :src="author?.photoUrl || 'https://placehold.co/50x50/999/fff?text=?'"
          :alt="author?.username || 'User'"
          class="rounded-circle me-3"
          width="50"
          height="50"
        />
        <div>
          <h5 class="mb-0">{{ author?.firstName || 'Пользователь' }} {{
              author?.lastName || ''
            }}</h5>
          <small class="text-muted">{{ formattedDate }}</small>
        </div>
      </div>
      <h4 class="post-title">
        <RouterLink :to="`/post/${post.id}`">{{ post.title }}</RouterLink>
      </h4>
    </div>
    <div class="post-preview">
      <p>{{ preview }}</p>
    </div>
    <div v-if="hasImages || hasRecipes" class="post-meta mt-3">
      <span v-if="hasImages" class="badge bg-secondary me-2">
        <svg class="icon" width="14" height="14">
          <use href="/src/assets/images/icons-sprite.svg#icon-images"></use>
        </svg>
        {{ post.images.length }} фото
      </span>
      <span v-if="hasRecipes" class="badge bg-secondary me-2">
        <svg class="icon" width="14" height="14">
          <use href="/src/assets/images/icons-sprite.svg#icon-book"></use>
        </svg>
        {{ post.recipes.length }} рецепт(а)
      </span>
    </div>
    <div class="post-footer mt-3 pt-3 border-top">
      <div class="d-flex justify-content-between">
        <div class="post-stats">
          <span class="me-3">
            <svg class="icon" aria-hidden="true" width="16" height="16">
              <use href="/src/assets/images/icons-sprite.svg#icon-heart"></use>
            </svg>
            {{ likesCount }}
          </span>
          <span>
            <svg class="icon" aria-hidden="true" width="16" height="16">
              <use href="/src/assets/images/icons-sprite.svg#icon-chat-dots"></use>
            </svg>
            {{ commentsCount }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue'
import {RouterLink} from 'vue-router'
import {useFormatters} from '@/composables/useFormatters'

const props = defineProps({
  post: {
    type: Object,
    required: true
  },
  author: {
    type: Object,
    default: null
  }
})

const {formatDate} = useFormatters()

const formattedDate = computed(() => {
  return formatDate(props.post.createdAt)
})

const preview = computed(() => {
  const content = props.post.content || ''
  return content.substring(0, 200) + (content.length > 200 ? '...' : '')
})

const hasImages = computed(() => {
  return props.post.images && props.post.images.length > 0
})

const hasRecipes = computed(() => {
  return props.post.recipes && props.post.recipes.length > 0
})

const likesCount = computed(() => {
  return Math.floor(Math.random() * 200 + 50)
})

const commentsCount = computed(() => {
  return Math.floor(Math.random() * 50 + 5)
})
</script>

<style scoped>
.icon {
  vertical-align: middle;
}
</style>
