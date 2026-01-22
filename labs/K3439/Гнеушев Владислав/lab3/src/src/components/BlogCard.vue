<template>
  <article class="card blog-card">
    <div class="card-body">
      <h3 class="card-title h5">{{ post.title }}</h3>
      <p class="card-text">
        <strong>Категория:</strong> {{ categoryNames[post.category] || '-' }}<br>
        <strong>Дата:</strong> {{ post.date }}
      </p>
      <router-link :to="`/blog/${post.id}`" class="btn btn-primary">Читать</router-link>
    </div>
  </article>
</template>

<script setup>
import { categoryNames } from '../composables/useFilters';

defineProps({
  post: {
    type: Object,
    required: true
  }
});
</script>
