<template>
  <section class="section-padding alt-bg">
    <div class="container">
      <div class="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <p class="eyebrow">Личный кабинет</p>
          <h2 class="h1 mb-0">Резюме и активность соискателя</h2>
        </div>
        <button
          class="btn btn-outline-light d-inline-flex align-items-center gap-2"
          @click="openResumeModal"
        >
          <svg class="icon" aria-hidden="true" focusable="false">
            <use href="#icon-bell"></use>
          </svg>
          Добавить резюме
        </button>
      </div>
      <div class="row g-4">
        <div class="col-lg-12">
          <div class="row g-3">
            <ResumeCard
              v-for="resume in resumes"
              :key="resume.id"
              :resume="resume"
              @edit="editResume"
            />
            <div v-if="resumes.length === 0" class="col-12">
              <div class="glass-panel p-4 text-center">
                <p class="text-muted mb-0">Резюме пока нет. Добавьте первое.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row g-3 mt-3">
        <div class="col-12">
          <div class="glass-panel p-4">
            <h6 class="mb-3">Активные отклики</h6>
            <div class="card-row">
              <ApplicationCard
                v-for="app in candidateApplications"
                :key="app.id"
                :application="app"
              />
              <div v-if="candidateApplications.length === 0" class="text-muted small">
                Откликов пока нет
              </div>
            </div>
          </div>
        </div>
      </div>

      <ResumeModal ref="resumeModal" :resume="editingResume" @saved="handleResumeSaved" />
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useJobsStore } from '@/stores/jobs'
import ResumeCard from '@/components/ResumeCard.vue'
import ApplicationCard from '@/components/ApplicationCard.vue'
import ResumeModal from '@/components/ResumeModal.vue'

const store = useJobsStore()

const resumes = computed(() => store.resumes)
const candidateApplications = computed(() => store.applications)
const editingResume = ref(null)
const resumeModal = ref(null)

const openResumeModal = () => {
  editingResume.value = null
  if (resumeModal.value) {
    resumeModal.value.show()
  }
}

const editResume = (resume) => {
  editingResume.value = resume
  if (resumeModal.value) {
    resumeModal.value.show()
  }
}

const handleResumeSaved = () => {
  editingResume.value = null
}
</script>
