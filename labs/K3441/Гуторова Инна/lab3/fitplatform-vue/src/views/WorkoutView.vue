<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useWorkout } from '@/composables/useWorkout'
import ScheduleModal from '@/components/ScheduleModal.vue'

const route = useRoute()
const id = Number(route.params.id)

const {
  workout,
  loading,
  error,
  markedDone,
  scheduleDate,
  markDone,
  scheduleWorkout
} = useWorkout(id)

const showScheduleModal = ref(false)

function openModal() { showScheduleModal.value = true }
function closeModal() { showScheduleModal.value = false }
function handleSchedule(date) {
  scheduleWorkout(date)
  showScheduleModal.value = false
}
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
          <div v-for="(instr, i) in workout.instructions" :key="i" class="exercise-card">
            {{ instr }}
          </div>
        </div>
      </div>

      <div class="my-3 d-flex gap-2">
        <button class="btn btn-success" @click="openModal">Запланировать тренировку</button>
        <button class="btn" :class="markedDone ? 'btn-success' : 'btn-outline-primary'" @click="markDone">
          {{ markedDone ? 'Выполнено' : 'Отметить как выполнено' }}
        </button>
      </div>

      <ScheduleModal
        v-if="showScheduleModal"
        :initialDate="scheduleDate"
        @close="closeModal"
        @submit="handleSchedule"
      />
    </template>
  </main>
</template>
