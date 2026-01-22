<template>
  <main class="container" style="margin-top: 50px; margin-bottom: 50px;" role="main" tabindex="-1" aria-labelledby="workoutsHeading">
    <h2 id="workoutsHeading" class="mb-4">Каталог тренировок</h2>
    
    <div class="row mb-4">
      <div class="col-md-4">
        <label for="filterLevel" class="form-label">Уровень</label>
        <select class="form-select" id="filterLevel" v-model="levelFilter">
          <option value="all">Все уровни</option>
          <option value="beginner">Начинающий</option>
          <option value="intermediate">Средний</option>
          <option value="advanced">Продвинутый</option>
        </select>
      </div>
      <div class="col-md-4">
        <label for="filterType" class="form-label">Тип тренировки</label>
        <select class="form-select" id="filterType" v-model="typeFilter">
          <option value="all">Все типы</option>
          <option value="cardio">Кардио</option>
          <option value="strength">Силовые</option>
          <option value="yoga">Йога</option>
          <option value="stretch">Растяжка</option>
        </select>
      </div>
      <div class="col-md-4">
        <label for="filterDuration" class="form-label">Продолжительность</label>
        <select class="form-select" id="filterDuration" v-model="durationFilter">
          <option value="all">Любая</option>
          <option value="15">15 минут</option>
          <option value="30">30 минут</option>
          <option value="45">45 минут</option>
          <option value="60">60+ минут</option>
        </select>
      </div>
    </div>

    <div class="row" role="list" aria-live="polite" aria-busy="false">
      <div v-if="loading" class="alert alert-info" role="listitem">
        Загружаем тренировки...
      </div>
      <div v-else-if="workouts.length === 0" class="col-12">
        <p class="text-muted">Тренировки не найдены. Попробуйте изменить фильтры.</p>
      </div>
      <div v-else v-for="workout in workouts" :key="workout.id" class="col-md-4" role="listitem">
        <WorkoutCard :workout="workout" />
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import WorkoutCard from '../components/WorkoutCard.vue';
import { useApi } from '../composables/useApi';
import { useWorkoutFilters } from '../composables/useFilters';

const { fetchWorkouts } = useApi();

const workouts = ref([]);
const loading = ref(true);
let workoutsRequestToken = 0;

const { levelFilter, typeFilter, durationFilter, workoutQuery } = useWorkoutFilters();

const loadWorkouts = async (query = {}) => {
  const currentRequest = ++workoutsRequestToken;
  loading.value = true;
  try {
    const data = await fetchWorkouts(query);
    if (currentRequest === workoutsRequestToken) {
      workouts.value = data;
      loading.value = false;
    }
  } catch (error) {
    console.error(error);
    if (currentRequest === workoutsRequestToken) {
      loading.value = false;
    }
  }
};

onMounted(() => {
  loadWorkouts();
});

watch(workoutQuery, (query) => {
  loadWorkouts(query);
});
</script>
