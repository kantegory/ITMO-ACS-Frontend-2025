<template>
  <div class="card h-100 shadow-sm">
    <div class="card-img-wrapper" style="height: 200px; overflow: hidden;">
      <img 
        :src="image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'" 
        class="card-img-top h-100 w-100 object-fit-cover"
        :alt="title"
      >
    </div>
    <div class="card-body d-flex flex-column">
      <h5 class="card-title">{{ title }}</h5>
      <p class="card-text text-muted flex-grow-1">{{ truncateDescription }}</p>
      
      <div class="d-flex justify-content-between align-items-center mt-auto">
        <div>
          <span class="badge bg-secondary">
            {{ difficultyText }}
          </span>
          <span class="badge bg-success ">
            {{ type }}
          </span>
        </div>
        <router-link 
          :to="`/recipe/${id}`" 
          class="btn btn-outline-success btn-sm"
        >
          Подробнее
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: 'Описание отсутствует'
  },
  difficulty: {
    type: String,
    default: 'Легко',
    validator: (value) => ['easy', 'medium', 'hard'].includes(value)
  },
  type: {
    type: String,
    default: 'Обед'
  },
  image: {
    type: String,
    default: ''
  }
})

const difficultyText = computed(() => {
  const map = {
    easy: 'Легко',
    medium: 'Средне',
    hard: 'Сложно'
  }
  return map[props.difficulty] || props.difficulty
})

const truncateDescription = computed(() => {
  if (props.description.length > 100) {
    return props.description.substring(0, 100) + '...'
  }
  return props.description
})
</script>

<style scoped>
.card {
  transition: transform 0.2s, box-shadow 0.2s;
  border: none;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.object-fit-cover {
  object-fit: cover;
}
</style>
