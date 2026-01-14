<template>
  <main class="container my-4">
    <h2 class="mb-4">Поиск тренировок</h2>

    <!-- ФИЛЬТРЫ -->
    <div class="d-flex gap-2 mb-3 flex-wrap">
      <select v-model="filters.level" class="form-select form-select-sm" style="max-width: 200px">
        <option value="all">Уровень: Все</option>
        <option value="beginner">Новичок</option>
        <option value="intermediate">Средний</option>
        <option value="advanced">Продвинутый</option>
      </select>

      <select v-model="filters.type" class="form-select form-select-sm" style="max-width: 200px">
        <option value="all">Тип: Все</option>
        <option value="cardio">Кардио</option>
        <option value="strength">Силовые</option>
        <option value="stretch">Растяжка</option>
        <option value="hiit">HIIT</option>
      </select>

      <select v-model="filters.duration" class="form-select form-select-sm" style="max-width: 200px">
        <option value="all">Длительность: Все</option>
        <option value="short">До 15 мин</option>
        <option value="medium">15–30 мин</option>
        <option value="long">30+ мин</option>
      </select>

      <button class="btn btn-primary btn-sm" @click="loadWorkouts">
        Применить
      </button>
    </div>

    <!-- СПИСОК -->
    <section class="row g-3">
      <div v-for="w in workouts" :key="w.id" class="col-md-4">
        <div class="card workout-card h-100">
          <img :src="w.image" class="card-img-top" />
          <div class="card-body d-flex flex-column">
            <h5>{{ w.title }}</h5>
            <p>{{ w.description }}</p>
            <RouterLink
              :to="`/workouts/${w.id}`"
              class="btn btn-primary btn-sm mt-auto"
            >
              Открыть
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- ПУСТО -->
    <p v-if="workouts.length === 0" class="text-center mt-4">
      По выбранным фильтрам ничего не найдено.
    </p>
  </main>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'

const api = useApi()

const workouts = ref([])

const filters = ref({
  level: 'all',
  type: 'all',
  duration: 'all'
})

async function loadWorkouts() {
  const params = {}

  if (filters.value.level !== 'all') params.level = filters.value.level
  if (filters.value.type !== 'all') params.type = filters.value.type
  if (filters.value.duration !== 'all') params.duration = filters.value.duration

  const { data } = await api.get('/workouts', {
    params
  })

  workouts.value = data
}

onMounted(loadWorkouts)
</script>
