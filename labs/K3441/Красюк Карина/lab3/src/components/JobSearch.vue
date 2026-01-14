<template>
  <form class="d-flex flex-grow-1 gap-2" @submit.prevent="$emit('search', keyword)" aria-label="Поиск вакансий">
    <label for="searchKeyword" class="visually-hidden">Поиск по названию вакансии или компании</label>
    <input
      type="text"
      id="searchKeyword"
      v-model="keyword"
      class="form-control"
      placeholder="Поиск по названию вакансии или компании"
      aria-label="Поиск по названию вакансии или компании"
    >
    <button class="btn btn-primary" type="submit" aria-label="Выполнить поиск">
      <span class="icon icon-sm me-1">
        <svg><use href="#icon-search"></use></svg>
      </span>
      Найти
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue'

defineEmits(['search'])

const keyword = ref('')
</script>

