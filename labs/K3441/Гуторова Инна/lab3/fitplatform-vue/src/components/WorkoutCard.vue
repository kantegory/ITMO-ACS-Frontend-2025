<template>
  <div class="col-md-4">
    <div class="card workout-card h-100">
      <img :src="workout.image" :alt="workout.title" />
      <div class="card-body">
        <h5>{{ workout.title }}</h5>
        <p>{{ workout.description }}</p>
        <RouterLink :to="`/workouts/${workout.id}`" class="btn btn-primary btn-sm">
          Открыть
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  workout: Object
})
</script>
