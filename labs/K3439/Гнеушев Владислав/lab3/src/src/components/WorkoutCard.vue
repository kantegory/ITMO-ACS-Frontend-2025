<template>
  <article class="card workout-card">
    <div class="card-body">
      <h3 class="card-title h5">{{ workout.title }}</h3>
      <p class="card-text">
        <strong>Уровень:</strong> {{ levelNames[workout.level] || '-' }}<br>
        <strong>Тип:</strong> {{ typeNames[workout.type] || '-' }}<br>
        <strong>Продолжительность:</strong> {{ workout.duration }} мин
      </p>
      <router-link :to="`/workouts/${workout.id}`" class="btn btn-primary">Подробнее</router-link>
    </div>
  </article>
</template>

<script setup>
import { levelNames, typeNames } from '../composables/useFilters';

defineProps({
  workout: {
    type: Object,
    required: true
  }
});
</script>
