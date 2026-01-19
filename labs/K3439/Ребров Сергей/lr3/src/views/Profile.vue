<template>
  <div class="container">
    <div v-if="!user" class="alert alert-warning">
      Вы не авторизованы. <router-link to="/login">Войти</router-link>
    </div>

    <div v-else>
      <div v-html="contactInfo"></div>

      <div v-if="user.role === 2" class="mt-4">
        <button class="btn btn-primary" @click="showForm = !showForm">
          {{ showForm ? 'Скрыть' : 'Создать вакансию' }}
        </button>

        <div v-if="showForm" class="mt-3" style="max-width:720px">
          <form @submit.prevent="create">
            <div class="mb-3">
              <label class="form-label">Название вакансии</label>
              <input v-model="form.title" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Компания</label>
              <input v-model="form.company" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Зарплата</label>
              <input v-model="form.salary" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label">Требуемый опыт</label>
              <input v-model="form.experience" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label">Описание</label>
              <textarea v-model="form.description" class="form-control" rows="4"></textarea>
            </div>
            <button class="btn btn-success" type="submit">Создать</button>
          </form>
        </div>
      </div>

      <div class="mt-5" v-if="user.role === 2">
        <h5>Ваши вакансии</h5>
        <div v-if="loading">Загрузка...</div>
        <div v-if="vacancies.length === 0" class="text-muted">Нет вакансий</div>
        <VacancyCard v-for="v in vacancies" :key="v.id" :vacancy="v" @delete="onDelete" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import VacancyCard from '@/components/VacancyCard.vue'
import { useAuth } from '@/composables/useAuth'
import useVacancies from '@/composables/useVacancies'

const { currentUser } = useAuth()
const u = currentUser()
const user = u.value

const { vacancies, loadVacancies, createVacancy, deleteVacancy, loading } = useVacancies()

const showForm = ref(false)
const form = ref({
  title: '',
  company: '',
  salary: '',
  experience: '',
  description: ''
})

onMounted(async () => {
  await loadVacancies()
})

async function create() {
  try {
    const payload = { ...form.value, ownerId: user?.id || null }
    await createVacancy(payload)
    await loadVacancies()
    showForm.value = false
    form.value = { title: '', company: '', salary: '', experience: '', description: '' }
  } catch (e) {
    alert('Ошибка создания: ' + (e.response?.data?.message || e.message))
  }
}

async function onDelete(id) {
  if (!confirm('Удалить вакансию?')) return
  try {
    await deleteVacancy(id)
    await loadVacancies()
  } catch (e) {
    alert('Ошибка удаления: ' + (e.response?.data?.message || e.message))
  }
}

const contactInfo = computed(() => {
  if (!user) return ''
  return `
    <div class="row">
      <div class="col mt-4">
        <div class="resume-section">
          <div class="resume-profile">
            <h5>Личные данные</h5>
          </div>
          <p><strong>Имя:</strong> ${user.name}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Роль:</strong> ${user.role === 1 ? 'Соискатель' : 'Работодатель'}</p>
        </div>
      </div>
    </div>
  `
})
</script>
