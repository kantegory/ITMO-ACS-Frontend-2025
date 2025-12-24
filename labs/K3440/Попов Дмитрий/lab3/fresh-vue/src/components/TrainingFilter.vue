<template>
  <div class="card p-3">
    <h6>Фильтр</h6>
    <select v-model="level" class="form-select mb-2">
      <option value="">Все</option>
      <option value="beginner">Начинающий</option>
      <option value="advanced">Продвинутый</option>
    </select>
    <select v-model="type" class="form-select mb-2">
      <option value="">Все</option>
      <option value="cardio">Кардио</option>
      <option value="strength">Силовая</option>
    </select>
    <input v-model.number="maxDuration" type="range" min="10" max="120" step="5" class="form-range">
    <div class="small text-muted mb-2">Максимум: {{ maxDuration }} мин</div>
    <button class="btn btn-primary btn-sm w-100" @click="$emit('apply', { level, type, maxDuration })">Применить
    </button>
  </div>
</template>


<script setup>
import {ref} from 'vue'

const level = ref('')
const type = ref('')
const maxDuration = ref(60)
</script>