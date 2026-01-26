<template>
  <div class="col-md-4 mb-4">
    <div class="card h-100 shadow-sm">
      <img
        :src="recipe.image || '/assets/img/example.jpg'"
        class="card-img-top"
        :alt="recipe.title"
        style="height:200px; object-fit:cover;"
        @error="fallbackImage"
      >
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">{{ recipe.title }}</h5>
        <p class="card-text text-muted small">{{ recipe.short || '' }}</p>
        <div class="mt-auto">
          <p class="mb-2"><small>Время: {{ recipe.time }} мин • {{ recipe.difficulty }}</small></p>
          <router-link
            :to="{ name: 'recipe', params: { id: recipe.id } }"
            class="btn btn-primary btn-sm"
          >
            Открыть рецепт
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  recipe: {
    type: Object,
    required: true
  }
})

const fallbackImage = (event) => {
  event.target.src = '/assets/img/example.jpg'
}
</script>