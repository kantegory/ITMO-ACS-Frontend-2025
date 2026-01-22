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
          <h5 class="modal-title">Редактирование резюме</h5>
          <button type="button" class="btn-close" @click="$emit('close')" aria-label="Закрыть"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit" class="needs-validation" novalidate>
            <div class="row g-3">
              <div class="col-md-6">
                <label for="editResumePosition" class="form-label">Желаемая должность</label>
                <input
                  type="text"
                  id="editResumePosition"
                  v-model="form.position"
                  class="form-control"
                  required
                >
              </div>
              <div class="col-md-3">
                <label for="editResumeSalary" class="form-label">Зарплата от, ₽</label>
                <input
                  type="number"
                  id="editResumeSalary"
                  v-model.number="form.salary"
                  class="form-control"
                  min="0"
                  step="1000"
                >
              </div>
              <div class="col-md-3">
                <label for="editResumeCity" class="form-label">Город</label>
                <input
                  type="text"
                  id="editResumeCity"
                  v-model="form.city"
                  class="form-control"
                >
              </div>
              <div class="col-12">
                <label for="editResumeSkills" class="form-label">Ключевые навыки</label>
                <input
                  type="text"
                  id="editResumeSkills"
                  v-model="skillsText"
                  class="form-control"
                  placeholder="JavaScript, React, HTML/CSS, Git"
                >
              </div>
              <div class="col-12">
                <label for="editResumeAbout" class="form-label">О себе</label>
                <textarea
                  id="editResumeAbout"
                  v-model="form.about"
                  class="form-control"
                  rows="3"
                ></textarea>
              </div>
            </div>
            <button type="submit" class="btn btn-primary mt-3" :disabled="loading">
              {{ loading ? 'Сохранение...' : 'Сохранить' }}
            </button>
          </form>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" @click="$emit('close')"></div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useResumes } from '@/composables/useResumes'
import { useAuth } from '@/composables/useAuth'
import { useNotifications } from '@/composables/useNotifications'

const props = defineProps({
  resume: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

const { update, create, loading } = useResumes()
const { user } = useAuth()
const { success, error: showError } = useNotifications()

const form = ref({
  position: '',
  salary: 0,
  city: '',
  skills: [],
  about: ''
})

const skillsText = ref('')

watch(() => props.resume, (newResume) => {
  if (newResume) {
    form.value = {
      position: newResume.position || '',
      salary: newResume.salary || 0,
      city: newResume.city || '',
      skills: newResume.skills || [],
      about: newResume.about || ''
    }
    skillsText.value = (newResume.skills || []).join(', ')
  }
}, { immediate: true })

const handleSubmit = async () => {
  try {
    const skills = skillsText.value.split(',').map(s => s.trim()).filter(s => s)
    
    if (props.resume) {
      await update(props.resume.id, {
        ...form.value,
        skills
      })
    } else {
      await create({
        userId: user.value.id,
        ...form.value,
        skills,
        employmentType: 'Полная',
        experience: [],
        education: '',
        isVisible: true
      })
    }
    
    success('Резюме успешно обновлено!')
    emit('saved')
  } catch (err) {
    showError(err.message || 'Ошибка сохранения резюме')
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

