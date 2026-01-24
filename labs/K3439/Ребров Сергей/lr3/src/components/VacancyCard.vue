<template>
  <div class="card mb-3">
    <div class="card-body">
      <h5 class="card-title">{{ vacancy.title }}</h5>
      <h6 class="card-subtitle mb-2">{{ vacancy.company }} • {{ vacancy.salary }}</h6>
      <p class="card-text text-truncate" style="max-height: 3.4rem">{{ vacancy.description }}</p>
      <div class="d-flex justify-content-start align-items-center">
        <router-link :to="{ name: 'Vacancy', params: { id: vacancy.id } }" class="btn btn-sm btn-primary">Подробнее</router-link>
        <div>
          <button v-if="canDelete" class="btn btn-sm btn-danger ms-2" @click="$emit('delete', vacancy.id)">Удалить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  vacancy: { type: Object, required: true }
})

const route = useRoute()

const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null

const canDelete = computed(() => {
  return (
    user &&
    (user.role === 2 || user.role === '2') &&
    route.name === 'Profile'
  )
})
</script>
