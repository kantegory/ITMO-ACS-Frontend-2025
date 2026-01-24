<template>
  <div
    class="modal fade show"
    style="display: block;"
    tabindex="-1"
    role="dialog"
    @click.self="$emit('close')"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Новая вакансия</h5>
          <button type="button" class="btn-close" @click="$emit('close')" aria-label="Закрыть"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit" class="needs-validation" novalidate>
            <div class="row g-3">
              <div class="col-md-6">
                <label for="newVacancyTitle" class="form-label">Название вакансии</label>
                <input
                  type="text"
                  id="newVacancyTitle"
                  v-model="form.title"
                  class="form-control"
                  required
                  placeholder="Например, Backend разработчик"
                >
              </div>
              <div class="col-md-3">
                <label for="newVacancySalary" class="form-label">Зарплата от, ₽</label>
                <input
                  type="number"
                  id="newVacancySalary"
                  v-model.number="form.salary"
                  class="form-control"
                  min="0"
                  step="1000"
                >
              </div>
              <div class="col-md-3">
                <label for="newVacancyCity" class="form-label">Город</label>
                <input
                  type="text"
                  id="newVacancyCity"
                  v-model="form.location"
                  class="form-control"
                  placeholder="Москва"
                >
              </div>
              <div class="col-md-6">
                <label for="newVacancyIndustry" class="form-label">Отрасль</label>
                <select id="newVacancyIndustry" v-model="form.industry" class="form-select">
                  <option>IT</option>
                  <option>Маркетинг</option>
                  <option>Финансы</option>
                  <option>Продажи</option>
                </select>
              </div>
              <div class="col-md-6">
                <label for="newVacancyExperience" class="form-label">Опыт</label>
                <select id="newVacancyExperience" v-model="form.experience" class="form-select">
                  <option value="junior">0–1 год</option>
                  <option value="middle">1–3 года</option>
                  <option value="senior">3+ года</option>
                </select>
              </div>
              <div class="col-12">
                <label for="newVacancyDescription" class="form-label">Описание</label>
                <textarea
                  id="newVacancyDescription"
                  v-model="form.description"
                  class="form-control"
                  rows="3"
                ></textarea>
              </div>
            </div>
            <button type="submit" class="btn btn-primary mt-3" :disabled="loading">
              {{ loading ? 'Создание...' : 'Сохранить вакансию' }}
            </button>
          </form>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" @click="$emit('close')"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useJobs } from '@/composables/useJobs'
import { useAuth } from '@/composables/useAuth'
import { useNotifications } from '@/composables/useNotifications'

const emit = defineEmits(['close', 'saved'])

const { create, loading } = useJobs()
const { user } = useAuth()
const { success, error: showError } = useNotifications()

const form = ref({
  title: '',
  salary: 0,
  location: '',
  industry: 'IT',
  experience: 'junior',
  description: ''
})

const handleSubmit = async () => {
  try {
    await create({
      ...form.value,
      company: user.value.companyName,
      employmentType: 'Полная занятость',
      workFormat: 'Офис',
      responsibilities: [],
      requirements: [],
      conditions: [],
      industry: form.value.industry.toLowerCase()
    })
    
    success('Вакансия успешно создана!')
    emit('saved')
  } catch (err) {
    showError(err.message || 'Ошибка создания вакансии')
  }
}
</script>

<style scoped>
.modal.show {
  display: block;
}
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1040;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  opacity: 0.5;
}
</style>

