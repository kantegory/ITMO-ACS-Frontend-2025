<template>
  <div class="card mb-3 training-card" role="article">
    <div class="row g-0">
      <div class="col-md-4">
        <img :src="workoutImage" class="img-fluid rounded-start h-100" :alt="workout.title">
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title fw-bold text-primary">{{ workout.title }}</h5>
          <p class="card-text">{{ workout.description }}</p>
          <p class="card-text">
            <span class="badge bg-secondary me-2">{{ workout.type.charAt(0).toUpperCase() + workout.type.slice(1) }}</span>
            <span class="badge bg-secondary me-2">{{ workout.level.charAt(0).toUpperCase() + workout.level.slice(1) }}</span>
            <span class="badge bg-secondary">{{ workout.duration }} мин</span>
          </p>
          <button class="btn btn-outline-brand btn-sm" @click="$emit('show-details', workout.id)">Подробнее</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'WorkoutCard',
  props: {
    workout: {
      type: Object,
      required: true
    }
  },
  emits: ['show-details'],
  setup(props) {
    const workoutImage = computed(() => {
      const imgColor = props.workout.type === 'силовые' ? '3498db' : 
                      (props.workout.type === 'кардио' ? '1abc9c' : '9b59b6')
      const imgText = props.workout.type.charAt(0).toUpperCase() + props.workout.type.slice(1)
      return `https://placehold.co/400x250/${imgColor}/ffffff?text=${imgText}`
    })

    return {
      workoutImage
    }
  }
}
</script>