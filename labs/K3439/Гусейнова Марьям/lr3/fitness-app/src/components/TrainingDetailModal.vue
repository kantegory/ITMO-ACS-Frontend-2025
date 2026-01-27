<template>
  <div class="modal fade" id="trainingDetailModal" tabindex="-1" aria-labelledby="trainingDetailModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="trainingDetailModalLabel">Детали Тренировки</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
        </div>
        <div class="modal-body">
          <h4 class="text-primary mb-3">{{ workout.title }}</h4>
          <div class="ratio ratio-16x9 mb-4">
            <iframe :src="workout.videoUrl" title="Видео с инструкцией к тренировке" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
          <h5>Описание и Инструкции</h5>
          <p>{{ workout.description }} Сегодня мы выполним:</p>
          <ul class="list-group list-group-flush" role="list">
            <li v-for="(instruction, index) in workout.instructions" :key="index" class="list-group-item">
              {{ instruction }}
            </li>
          </ul>
          <button class="btn btn-primary mt-4">Начать тренировку</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap'
import { ref, onMounted } from 'vue'

export default {
  name: 'TrainingDetailModal',
  setup() {
    const modal = ref(null)
    const workout = ref({
      title: '',
      description: '',
      videoUrl: '',
      instructions: []
    })

    onMounted(() => {
      const modalElement = document.getElementById('trainingDetailModal')
      modal.value = new Modal(modalElement)
    })

    const showTrainingDetails = (workoutData) => {
      workout.value = { ...workoutData }
      modal.value.show()
    }

    return {
      workout,
      showTrainingDetails
    }
  }
}
</script>