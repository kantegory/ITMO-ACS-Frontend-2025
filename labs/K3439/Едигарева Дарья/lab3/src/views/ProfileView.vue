<template>
  <section class="section container">
    <div class="section__header">
      <h2 class="section__title">Личный кабинет соискателя</h2>
      <p class="section__subtitle">
        Заполните профиль, чтобы резюме отображалось на странице вакансии.
      </p>
    </div>
    <div class="row g-4">
      <div class="col-lg-6">
        <div class="card shadow-sm h-100">
          <div class="card-body">
            <h5 class="card-title">Моё резюме</h5>
            <form class="row g-3" @submit.prevent="saveProfile">
              <div class="col-md-6">
                <label class="form-label">Должность</label>
                <input type="text" class="form-control" v-model="form.position" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Город</label>
                <input type="text" class="form-control" v-model="form.city" />
              </div>
              <div class="col-12">
                <label class="form-label">Обо мне</label>
                <textarea
                  class="form-control"
                  rows="3"
                  placeholder="Коротко о себе: стек, опыт, достижения"
                  v-model="form.about"
                ></textarea>
              </div>
              <div class="col-12">
                <label class="form-label">Ключевые навыки</label>
                <input type="text" class="form-control" v-model="form.skills" />
              </div>
              <div class="col-12 d-flex gap-2">
                <button class="btn btn-primary minw-140" type="submit">Сохранить</button>
                <button class="btn btn-outline-secondary minw-140" type="button" disabled>
                  Экспорт PDF
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <resume-card :profile="profile" />
      </div>
    </div>
  </section>
</template>

<script>
import { computed, onMounted, reactive } from 'vue'
import { useJobsStore } from '@/stores/jobs'
import ResumeCard from '@/components/ResumeCard.vue'

export default {
  name: 'ProfileView',
  components: { ResumeCard },
  setup() {
    const store = useJobsStore()
    const form = reactive({
      position: '',
      city: '',
      about: '',
      skills: '',
    })

    const profile = computed(() => store.profile)

    const syncForm = () => {
      form.position = profile.value?.position || ''
      form.city = profile.value?.city || ''
      form.about = profile.value?.about || ''
      form.skills = profile.value?.skills || ''
    }

    const saveProfile = async () => {
      await store.saveProfile({
        position: form.position,
        city: form.city,
        about: form.about,
        skills: form.skills,
        fullName: profile.value?.fullName || 'Мой профиль',
      })
      syncForm()
    }

    onMounted(async () => {
      await store.loadProfile()
      syncForm()
    })

    return { form, profile, saveProfile }
  },
}
</script>
