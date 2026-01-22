<template>
  <main class="container" style="margin-top: 50px; margin-bottom: 50px;" role="main" tabindex="-1" aria-labelledby="profileHeading">
    <h2 id="profileHeading" class="mb-4">Личный кабинет</h2>
    
    <div class="row mb-4">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h3 class="card-title h5">Информация о пользователе</h3>
            <p><strong>Имя:</strong> <span id="userName">{{ user?.name || 'Пользователь' }}</span></p>
            <p><strong>Email:</strong> <span id="userEmail">{{ user?.email || 'user@example.com' }}</span></p>
            <button class="btn btn-primary" @click="showEditModal = true">Редактировать профиль</button>
          </div>
        </div>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-md-12">
        <h3>Трекер прогресса</h3>
        <div class="row">
          <div class="col-md-3">
            <div class="card">
              <div class="card-body text-center">
                <h4 id="completedWorkouts" aria-live="polite">{{ stats.completedWorkouts }}</h4>
                <p>Выполнено тренировок</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card">
              <div class="card-body text-center">
                <h4 id="burnedCalories" aria-live="polite">{{ stats.burnedCalories }}</h4>
                <p>Сожжено калорий</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card">
              <div class="card-body text-center">
                <h4 id="workoutDays" aria-live="polite">{{ stats.workoutDays }}</h4>
                <p>Дней тренировок</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card">
              <div class="card-body text-center">
                <h4 id="currentStreak" aria-live="polite">{{ stats.currentStreak }}</h4>
                <p>Дней подряд</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-md-12">
        <h3>План тренировок на неделю</h3>
        <table class="table table-bordered" aria-describedby="planCaption">
          <caption id="planCaption">Расписание тренировок по дням недели</caption>
          <thead>
            <tr>
              <th>День недели</th>
              <th>Тренировка</th>
              <th>Продолжительность</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody id="workoutPlanTable">
            <tr v-for="day in dayLabels" :key="day.key">
              <td>{{ day.label }}</td>
              <td>{{ plan[day.key]?.title || '-' }}</td>
              <td>{{ plan[day.key] ? `${plan[day.key].duration} мин` : '-' }}</td>
              <td>{{ plan[day.key] ? mapPlanStatus(plan[day.key].status) : '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>

  <!-- Edit Profile Modal -->
  <div class="modal fade" :class="{ show: showEditModal }" :style="{ display: showEditModal ? 'block' : 'none' }" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="editProfileModalLabel">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title h5" id="editProfileModalLabel">Редактировать профиль</h2>
          <button type="button" class="btn-close" @click="showEditModal = false"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleEditProfile">
            <div class="mb-3">
              <label for="editName" class="form-label">Имя</label>
              <input type="text" class="form-control" id="editName" v-model="editName" required>
            </div>
            <div class="mb-3">
              <label for="editEmail" class="form-label">Email</label>
              <input type="email" class="form-control" id="editEmail" v-model="editEmail" required>
            </div>
            <button type="submit" class="btn btn-primary" :disabled="saving">
              {{ saving ? 'Сохранение...' : 'Сохранить' }}
            </button>
            <FormFeedback :message="editMessage" :type="editMessageType" />
          </form>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showEditModal" class="modal-backdrop fade show" @click="showEditModal = false"></div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useApi } from '../composables/useApi';
import { dayLabels, mapPlanStatus } from '../composables/useFilters';
import FormFeedback from '../components/FormFeedback.vue';

const router = useRouter();
const { currentUser } = useAuth();
const { syncCurrentUser, updateUserProfile, buildEmptyStats, buildEmptyPlan } = useApi();

const user = ref(null);
const showEditModal = ref(false);
const editName = ref('');
const editEmail = ref('');
const editMessage = ref('');
const editMessageType = ref('error');
const saving = ref(false);

const stats = computed(() => user.value?.stats || buildEmptyStats());
const plan = computed(() => user.value?.plan || buildEmptyPlan());

onMounted(async () => {
  const synced = await syncCurrentUser();
  
  if (!synced) {
    alert('Войдите в аккаунт чтобы открыть профиль');
    router.push('/login');
    return;
  }

  user.value = synced;
  editName.value = synced.name;
  editEmail.value = synced.email;
});

watch(currentUser, (newVal) => {
  if (newVal) {
    user.value = newVal;
  }
});

async function handleEditProfile() {
  saving.value = true;
  editMessage.value = '';

  try {
    const updatedUser = await updateUserProfile({
      id: user.value.id,
      name: editName.value.trim(),
      email: editEmail.value.trim()
    });

    user.value = updatedUser;
    editMessage.value = 'Данные обновлены';
    editMessageType.value = 'success';
    
    setTimeout(() => {
      showEditModal.value = false;
      editMessage.value = '';
    }, 1000);
  } catch (error) {
    console.error(error);
    editMessage.value = 'Не удалось сохранить изменения';
    editMessageType.value = 'error';
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.modal.show {
  display: block;
}
</style>
