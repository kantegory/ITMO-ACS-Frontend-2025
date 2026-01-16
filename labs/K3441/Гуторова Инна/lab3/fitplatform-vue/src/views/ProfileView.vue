<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useProfile } from '@/composables/useProfile'

const router = useRouter()
const { user, isAuthenticated } = useAuth()

if (!isAuthenticated) {
  router.push('/')
}

const {
  stats,
  history,
  planned,
  loadStats,
  loadWorkouts,
  removeItem
} = useProfile(user.value.id)

onMounted(async () => {
  await loadStats()
  await loadWorkouts()
})
</script>


<template>
  <main class="container my-4">

    <h2 class="mb-4">Личный кабинет</h2>

    <div class="row g-3 mb-4">
      <div class="col-md-4" v-for="(value, key) in [
        { title: 'Прогресс', value: stats.progress + '%', desc: 'Выполнение плана' },
        { title: 'Тренировок', value: stats.workouts, desc: 'За месяц' },
        { title: 'Общее время', value: stats.hours + ' ч', desc: 'Тренировок' }
      ]" :key="key">
        <div class="card text-center p-3">
          <h5>{{ value.title }}</h5>
          <p class="h2">{{ value.value }}</p>
          <small>{{ value.desc }}</small>
        </div>
      </div>
    </div>

    <div class="row g-4">

      <div class="col-md-6">
        <h4 class="section-title">История тренировок</h4>

        <div
          v-for="item in history"
          :key="item.id"
          class="workout-list-item d-flex justify-content-between align-items-center mb-2"
        >
          <span>{{ item.date }} — {{ item.title }}</span>

          <div class="d-flex">
            <router-link
              :to="`/workouts/${item.workoutId}`"
              class="btn btn-sm btn-outline-primary"
            >
              Перейти
            </router-link>

            <button
              class="btn btn-sm btn-outline-danger ms-2"
              @click="removeItem('history', item.id)"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <h4 class="section-title">Запланированные тренировки</h4>

        <div
          v-for="item in planned"
          :key="item.id"
          class="workout-list-item d-flex justify-content-between align-items-center mb-2"
        >
          <span>{{ item.date }} — {{ item.title }}</span>

          <div class="d-flex">
            <router-link
              :to="`/workouts/${item.workoutId}`"
              class="btn btn-sm btn-outline-success"
            >
              Перейти
            </router-link>

            <button
              class="btn btn-sm btn-outline-danger ms-2"
              @click="removeItem('planned', item.id)"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>

    </div>
  </main>
</template>
