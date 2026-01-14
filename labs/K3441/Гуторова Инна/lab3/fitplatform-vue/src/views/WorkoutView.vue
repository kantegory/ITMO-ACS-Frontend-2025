<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '@/composables/useApi'

const route = useRoute()
const api = useApi()

const workout = ref(null)
const loading = ref(true)
const error = ref(null)
const markedDone = ref(false)

// Для модалки
const showScheduleModal = ref(false)
const plannedDate = ref(new Date().toISOString().split('T')[0]) // по умолчанию сегодняшняя дата

const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
const token = localStorage.getItem('token')

const id = Number(route.params.id)

// Загрузка тренировки
async function loadWorkout() {
  try {
    const { data } = await api.get(`/workouts/${id}`)
    workout.value = data
  } catch (e) {
    error.value = 'Тренировка не найдена'
  } finally {
    loading.value = false
  }
}

// Отметить как выполнено
async function markDone() {
  if (!token || !user.value) return alert('Доступно только авторизованным пользователям')

  try {
    await api.post('/history', {
      userId: user.value.id,
      workoutId: id,
      date: new Date().toISOString().split('T')[0]
    })
    markedDone.value = true
  } catch (err) {
    console.error(err)
    alert('Ошибка при отметке выполнения')
  }
}

// Планирование тренировки
async function scheduleWorkout() {
  if (!plannedDate.value) return alert('Выберите дату')
  if (!token || !user.value) return alert('Доступно только авторизованным пользователям')

  try {
    await api.post('/planned', {
      userId: user.value.id,
      workoutId: id,
      date: plannedDate.value
    })
    alert(`Тренировка запланирована на ${plannedDate.value}`)
    showScheduleModal.value = false
  } catch (err) {
    console.error(err)
    alert('Ошибка при планировании')
  }
}

onMounted(loadWorkout)
</script>

<template>
  <main class="container mt-4 mb-5">
    <div v-if="loading">Загрузка...</div>
    <div v-else-if="error">{{ error }}</div>
    <template v-else>
      <div class="workout-header">
        <h1>{{ workout.title }}</h1>
        <p class="mb-0">Уровень: {{ workout.level }}</p>
      </div>

      <div class="ratio ratio-16x9 mb-4">
        <iframe :src="workout.video" title="Workout video" allowfullscreen />
      </div>

      <div class="mb-4">
        <h5>Описание</h5>
        <p>{{ workout.description }}</p>
      </div>

      <div>
        <h5>Упражнения</h5>
        <div>
          <div
            v-for="(instr, i) in workout.instructions"
            :key="i"
            class="exercise-card"
          >
            {{ instr }}
          </div>
        </div>
      </div>

      <div class="my-3 d-flex gap-2">
        <!-- Кнопка открытия модалки -->
        <button class="btn btn-success" @click="showScheduleModal = true">
          Запланировать тренировку
        </button>

        <!-- Отметить как выполнено -->
        <button
          class="btn"
          :class="markedDone ? 'btn-success' : 'btn-outline-primary'"
          @click="markDone"
        >
          {{ markedDone ? 'Выполнено' : 'Отметить как выполнено' }}
        </button>
      </div>

      <!-- Модальное окно -->
      <div
        v-if="showScheduleModal"
        class="modal d-block"
        tabindex="-1"
        style="background: rgba(0,0,0,0.5);"
      >
        <div class="modal-dialog">
          <form class="modal-content" @submit.prevent="scheduleWorkout">
            <div class="modal-header">
              <h5 class="modal-title">Запланировать тренировку</h5>
              <button type="button" class="btn-close" @click="showScheduleModal = false"></button>
            </div>
            <div class="modal-body">
              <label for="planDate" class="form-label">Выберите дату</label>
              <input
                id="planDate"
                type="date"
                class="form-control"
                v-model="plannedDate"
                required
              />
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showScheduleModal = false">
                Отмена
              </button>
              <button type="submit" class="btn btn-success">Добавить в план</button>
            </div>
          </form>
        </div>
      </div>
    </template>
  </main>
</template>
