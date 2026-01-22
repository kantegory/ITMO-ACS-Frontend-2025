<script setup>
import { computed } from 'vue';
const props = defineProps(["name", "imageLink", "description", "id", "maxHeight"]);

const imageStyle = computed(() => ({
  'max-height': `${props.maxHeight || 400}px`,
  'object-fit': 'cover'
}))
</script>

<template>
  <div class="col-md-6">
    <div class="card shadow-sm border-0">
      <img
        :src=props.imageLink
        class="card-img-top"
        :alt=props.name
        :style="imageStyle"
      />
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">{{ props.name }}</h5>
        <router-link class="btn btn-danger mt-3" :to="{ name: 'recipe', params: { recipeId:  props.id} }">Смотреть рецепт</router-link>
      </div>
    </div>
  </div>
</template>
