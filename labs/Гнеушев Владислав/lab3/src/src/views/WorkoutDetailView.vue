<template>
  <main class="container" style="margin-top: 50px; margin-bottom: 50px;" role="main" tabindex="-1" aria-labelledby="workoutTitle">
    <div class="row">
      <div class="col-12 mb-4">
        <h2 id="workoutTitle">{{ workout?.title || 'Загрузка...' }}</h2>
        <p id="workoutLevel">{{ workout ? `Уровень: ${levelNames[workout.level] || '-'}` : '' }}</p>
        <p id="workoutType">{{ workout ? `Тип: ${typeNames[workout.type] || '-'}` : '' }}</p>
        <p id="workoutDuration">{{ workout ? `Продолжительность: ${workout.duration} минут` : '' }}</p>
      </div>
    </div>

    <div class="row mb-4" v-if="workout">
      <div class="col-md-8">
        <div class="ratio ratio-16x9">
          <iframe :src="workout.video" title="Видео тренировки" allowfullscreen></iframe>
        </div>
      </div>
      <div class="col-md-4">
        <p id="workoutDescription">{{ workout.description }}</p>
        <button class="btn btn-success mt-3" @click="openAddToPlanModal">Добавить в план</button>
      </div>
    </div>

    <div class="row mb-4" v-if="workout">
      <div class="col-12">
        <h3>Инструкция</h3>
        <div class="accordion" id="instructionsAccordion">
          <div v-for="(inst, index) in workout.instructions" :key="index" class="accordion-item">
            <h2 class="accordion-header">
              <button 
                class="accordion-button" 
                :class="{ collapsed: index !== 0 }" 
                type="button" 
                data-bs-toggle="collapse" 
                :data-bs-target="`#collapse${index}`"
              >
                {{ inst.step }}. {{ inst.title }}
              </button>
            </h2>
            <div :id="`collapse${index}`" class="accordion-collapse collapse" :class="{ show: index === 0 }">
              <div class="accordion-body">
                {{ inst.description }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row" v-if="workout">
      <div class="col-12">
        <h3>Оборудование</h3>
        <ul id="equipmentList">
          <li v-for="item in workout.equipment" :key="item">{{ item }}</li>
        </ul>
      </div>
    </div>

    <!-- Add to Plan Modal -->
    <div class="modal fade" id="addToPlanModal" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="addToPlanModalLabel" ref="modalRef">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addToPlanModalLabel">Добавить в план</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="workoutTitleDisplay" class="form-label">Тренировка</label>
              <input type="text" class="form-control" id="workoutTitleDisplay" :value="workout?.title" readonly>
            </div>
            <div class="mb-3">
              <label for="dayOfWeek" class="form-label">День недели</label>
              <select class="form-select" id="dayOfWeek" v-model="selectedDay">
                <option value="">Выберите день</option>
                <option v-for="day in dayLabels" :key="day.key" :value="day.key">{{ day.label }}</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
            <button type="button" class="btn btn-primary" @click="confirmAddToPlan">Добавить</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useApi } from '../composables/useApi';
import { levelNames, typeNames, dayLabels } from '../composables/useFilters';

const route = useRoute();
const router = useRouter();
const { fetchWorkoutById, saveWorkoutToPlan, syncCurrentUser } = useApi();

const workout = ref(null);
const selectedDay = ref('');
const modalRef = ref(null);
let modalInstance = null;

onMounted(async () => {
  const workoutId = parseInt(route.params.id, 10);
  
  if (!Number.isFinite(workoutId)) {
    return;
  }

  try {
    workout.value = await fetchWorkoutById(workoutId);
  } catch (error) {
    console.error(error);
  }

  if (typeof window !== 'undefined' && window.bootstrap) {
    const modalElement = document.getElementById('addToPlanModal');
    if (modalElement) {
      modalInstance = new window.bootstrap.Modal(modalElement);
    }
  }
});

function openAddToPlanModal() {
  selectedDay.value = '';
  if (modalInstance) {
    modalInstance.show();
  }
}

async function confirmAddToPlan() {
  if (!selectedDay.value) {
    alert('Пожалуйста, выберите день недели');
    return;
  }

  const user = await syncCurrentUser();
  if (!user) {
    alert('Авторизуйтесь, чтобы составлять план');
    router.push('/login');
    return;
  }

  try {
    await saveWorkoutToPlan(selectedDay.value, workout.value);
    if (modalInstance) {
      modalInstance.hide();
    }
    alert('Тренировка добавлена в план');
  } catch (error) {
    console.error(error);
    alert('Не удалось сохранить тренировку в план');
  }
}
</script>
