<template>
  <div class="modal fade" id="resumeModal" tabindex="-1" aria-hidden="true" role="dialog" ref="modalElement">
    <div class="modal-dialog">
      <div class="modal-content glass-panel">
        <div class="modal-header border-0">
          <h5 class="modal-title" id="resumeModalTitle">Новое резюме</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label class="form-label" for="resumeTitle">Позиция</label>
              <input
                type="text"
                class="form-control"
                id="resumeTitle"
                v-model="form.title"
                placeholder="Product Manager"
                required
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Город</label>
              <input type="text" class="form-control" id="resumeCity" v-model="form.city" placeholder="Казань" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Опыт (лет)</label>
              <input
                type="number"
                class="form-control"
                id="resumeYears"
                v-model.number="form.experienceYears"
                min="0"
                max="40"
                value="3"
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Навыки (через запятую)</label>
              <input
                type="text"
                class="form-control"
                id="resumeSkillsInput"
                v-model="form.skillsText"
                placeholder="SQL, A/B, UX"
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Кратко</label>
              <textarea
                class="form-control"
                id="resumeSummary"
                rows="3"
                v-model="form.summary"
                placeholder="Короткое описание опыта"
                required
              ></textarea>
            </div>
            <button type="submit" class="btn btn-primary w-100">Сохранить резюме</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, ref, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import { useJobsStore } from '@/stores/jobs'

const props = defineProps({
  resume: { type: Object, default: null },
})

const emit = defineEmits(['saved'])

const store = useJobsStore()
const modalElement = ref(null)
let modal = null

const form = reactive({
  id: null,
  title: '',
  city: '',
  experienceYears: 0,
  summary: '',
  skillsText: '',
})

onMounted(() => {
  if (modalElement.value) {
    modal = new Modal(modalElement.value)
  }
})

const show = () => {
  if (modal) {
    modal.show()
  }
}

defineExpose({ show })

watch(
  () => props.resume,
  (resume) => {
    if (resume) {
      form.id = resume.id || null
      form.title = resume.title || ''
      form.city = resume.city || ''
      form.experienceYears = resume.experienceYears || 0
      form.summary = resume.summary || ''
      form.skillsText = Array.isArray(resume.skills) ? resume.skills.join(', ') : resume.skills || ''
    } else {
      form.id = null
      form.title = ''
      form.city = ''
      form.experienceYears = 0
      form.summary = ''
      form.skillsText = ''
    }
  },
  { immediate: true }
)

const handleSubmit = async () => {
  const payload = {
    id: form.id,
    title: form.title,
    city: form.city,
    experienceYears: form.experienceYears,
    summary: form.summary,
    skills: form.skillsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  }

  await store.saveResume(payload)

  form.id = null
  form.title = ''
  form.city = ''
  form.experienceYears = 0
  form.summary = ''
  form.skillsText = ''

  if (modal) {
    modal.hide()
  }

  emit('saved')
}
</script>
