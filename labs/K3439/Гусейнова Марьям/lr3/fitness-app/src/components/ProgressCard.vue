<template>
  <div class="card p-4 h-100">
    <h3 class="fw-bold mb-3">
      <svg class="icon me-2 text-success" aria-hidden="true"><use href="/icons.svg#icon-graph-up"></use></svg>
      Трекинг Прогресса
    </h3>
    <ul class="list-group list-group-flush">
      <li class="list-group-item d-flex justify-content-between align-items-center">
        Вес: <span>{{ progress.weight }} кг</span> <span class="badge bg-success">↓ -1.5 кг</span>
      </li>
      <li class="list-group-item d-flex justify-content-between align-items-center">
        Тренировок за неделю: <span>{{ progress.weeklyWorkouts }}</span> <span class="badge bg-primary">+1</span>
      </li>
      <li class="list-group-item d-flex justify-content-between align-items-center">
        Цель: 50 отжиманий <span class="badge bg-warning text-dark">{{ progress.pushupGoal }}/50</span>
      </li>
    </ul>
    <button class="btn btn-outline-brand mt-3">Обновить данные</button>
  </div>
</template>

<script>
export default {
  name: 'ProgressCard',
  props: {
    progress: {
      type: Object,
      required: true,
      default: () => ({
        weight: 75,
        weeklyWorkouts: 4,
        pushupGoal: 35
      })
    }
  }
}
</script>