<template>
  <div class="stared-recipes">
    <h3 class="mb-4">Сохранённые рецепты</h3>

    <div v-if="!staredRecipes.length" class="text-muted">Пока нет сохранённых рецептов</div>

    <div class="row">
      <div v-for="recipe in staredRecipes" :key="recipe.id" class="col-md-6 mb-3">
        <div class="card h-100">
          <img 
            :src="getImage(recipe.image)" 
            class="card-img-top" 
            :alt="recipe.title" 
            style="height: 200px; object-fit: cover"
          >
          <div class="card-body">
            <h5 class="card-title">{{ recipe.title }}</h5>
            <span class="badge bg-secondary me-1">{{ recipe.type }}</span>
            <span class="badge bg-info">{{ recipe.difficulty }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import useStared from '@/composables/useStared'

const props = defineProps({
  user: { type: Object, required: true }
})

const { staredRecipes, loadStared, removeStared } = useStared()

const remove = async (id) => {
  await removeStared(props.user.id, id)
}

const getImage = (img) => {
  try {
    return img ? new URL(`../assets/img/${img}`, import.meta.url).href : ''
  } catch {
    return ''
  }
}

onMounted(() => {
  loadStared(props.user.id)
})
</script>

