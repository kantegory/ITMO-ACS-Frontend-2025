<template>
  <div class="recipe-full">
    <div class="text-center mb-3">
      <h1>{{ recipe.title }}</h1>

      <div class="mt-2">
        <span class="badge bg-secondary me-2">Сложность: {{ recipe.difficulty }}</span>
        <span class="badge bg-primary me-2">{{ recipe.type }}</span>
      </div>

      <div v-if="recipe.author" class="mt-2 d-flex justify-content-center align-items-center gap-3">
        <p class="mb-0">Автор: <strong>{{ recipe.author }}</strong></p>
      </div>
    </div>

    <div class="card mb-4">
      <div class="card-header"><h3>Ингредиенты</h3></div>
      <div class="card-body">
        <ul class="list-group">
          <li v-for="(ingredient, index) in recipe.ingredients || []" :key="index" class="list-group-item">
            {{ ingredient }}
          </li>
        </ul>
      </div>
    </div>

    <div class="card mb-4">
      <div class="card-header"><h3>Приготовление</h3></div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <h4>Пошаговая инструкция</h4>
            <div v-for="(step, index) in recipe.steps || []" :key="index" class="mb-3">
              <h5>Шаг {{ index + 1 }}</h5>
              <p>{{ step }}</p>
            </div>
          </div>
          <div class="col-md-6">
            <h4 class="text-center">Видео-инструкция</h4>
            <video :src="videoSrc" controls class="w-100" style="max-height: 400px"></video>
          </div>
        </div>
      </div>
    </div>

    <div class="card mb-4">
      <div class="card-header"><h3>Фото готового блюда</h3></div>
      <div class="card-body text-center">
        <img :src="imageSrc" :alt="recipe.title" class="img-fluid" style="max-height: 400px; object-fit: cover">
      </div>
    </div>

    <div class="text-center mb-4" v-if="user?.id">
      <button class="btn me-2" :class="isStaredLocal ? 'btn-warning' : 'btn-outline-warning'" @click="toggleStared">
        {{ isStaredLocal ? '★' : '☆' }}
      </button>
    </div>

    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h3 class="mb-0">Комментарии</h3>
      </div>
      <div class="card-body">
        <div v-if="comments.length">
          <div v-for="(comment, index) in comments" :key="index" class="mb-3 p-2 border rounded">
            <div class="d-flex justify-content-between">
              <strong>{{ comment.user }}</strong>
            </div>
            <p class="mb-0 mt-1">{{ comment.text }}</p>
          </div>
        </div>

        <div class="mt-4">
          <h5>Прокомментировать:</h5>
          <div class="input-group">
            <input v-model="commentText" type="text" class="form-control" placeholder="Ваш комментарий..." @keyup.enter="submitComment" />
            <button class="btn btn-primary" @click="submitComment" :disabled="!commentText.trim()">Отправить</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue'
import useStared from '@/composables/useStared'

const props = defineProps({
  recipe: { type: Object, required: true },
  user: { type: Object, default: () => ({}) },
  comments: { type: Array, default: () => [] }
})

const emit = defineEmits(['add-comment'])

const { staredRecipes, loadStared, addStared, removeStared, isStared } = useStared()

const commentText = ref('')
const isStaredLocal = ref(false)

watchEffect(async () => {
  if (props.user?.id) await loadStared(props.user.id)
  isStaredLocal.value = isStared(props.recipe.id)
})

const toggleStared = async () => {
  if (!props.user?.id) {
    alert('Сначала войдите в систему')
    return
  }

  if (isStaredLocal.value) {
    await removeStared(props.user.id, props.recipe.id)
  } 
  else {
    await addStared(props.user.id, props.recipe)
  }
  isStaredLocal.value = !isStaredLocal.value
}

const submitComment = () => {
  if (!commentText.value.trim()) return
  emit('add-comment', commentText.value)
  commentText.value = ''
}

const imageSrc = computed(() => {
  try { return new URL(`../assets/img/${props.recipe.image}`, import.meta.url).href } 
  catch(e) { console.warn(`img not found: ${props.recipe.image}`) }
})

const videoSrc = computed(() => {
  try { return new URL(`../assets/video/${props.recipe.video}`, import.meta.url).href } 
  catch(e) {}
})
</script>