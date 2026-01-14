<template>
  <div class="tab-content" id="reg-tabContent">
    <section
      class="tab-pane fade"
      :class="{ 'show active': activeTab === 'candidate' }"
      id="reg-candidate"
      role="tabpanel"
    >
      <form @submit.prevent="handleSubmit('candidate')" class="needs-validation" novalidate aria-label="Форма регистрации соискателя">
        <div class="mb-3">
          <label for="regCandidateName" class="form-label">Имя и фамилия</label>
          <input
            type="text"
            id="regCandidateName"
            v-model="candidateForm.name"
            class="form-control"
            required
            aria-required="true"
          >
          <div class="invalid-feedback">Заполните имя и фамилию.</div>
        </div>
        <div class="mb-3">
          <label for="regCandidateEmail" class="form-label">E-mail</label>
          <input
            type="email"
            id="regCandidateEmail"
            v-model="candidateForm.email"
            class="form-control"
            required
            aria-required="true"
          >
          <div class="invalid-feedback">Введите корректный e-mail.</div>
        </div>
        <div class="mb-3">
          <label for="regCandidatePassword" class="form-label">Пароль</label>
          <input
            type="password"
            id="regCandidatePassword"
            v-model="candidateForm.password"
            class="form-control"
            required
            minlength="6"
            aria-required="true"
          >
          <div class="invalid-feedback">Минимум 6 символов.</div>
        </div>
        <div class="mb-3">
          <label for="regCandidatePosition" class="form-label">Желаемая должность</label>
          <input
            type="text"
            id="regCandidatePosition"
            v-model="candidateForm.position"
            class="form-control"
            placeholder="Например, Frontend разработчик"
          >
        </div>
        <button type="submit" class="btn btn-primary w-100 mb-2" :disabled="loading">
          {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
        </button>
      </form>
    </section>

    <section
      class="tab-pane fade"
      :class="{ 'show active': activeTab === 'employer' }"
      id="reg-employer"
      role="tabpanel"
    >
      <form @submit.prevent="handleSubmit('employer')" class="needs-validation" novalidate aria-label="Форма регистрации работодателя">
        <div class="mb-3">
          <label for="regEmployerCompany" class="form-label">Название компании</label>
          <input
            type="text"
            id="regEmployerCompany"
            v-model="employerForm.companyName"
            class="form-control"
            required
            aria-required="true"
          >
          <div class="invalid-feedback">Введите название компании.</div>
        </div>
        <div class="mb-3">
          <label for="regEmployerEmail" class="form-label">E-mail компании</label>
          <input
            type="email"
            id="regEmployerEmail"
            v-model="employerForm.email"
            class="form-control"
            required
            aria-required="true"
          >
          <div class="invalid-feedback">Введите корректный e-mail.</div>
        </div>
        <div class="mb-3">
          <label for="regEmployerPassword" class="form-label">Пароль</label>
          <input
            type="password"
            id="regEmployerPassword"
            v-model="employerForm.password"
            class="form-control"
            required
            minlength="6"
            aria-required="true"
          >
          <div class="invalid-feedback">Минимум 6 символов.</div>
        </div>
        <div class="mb-3">
          <label for="regEmployerIndustry" class="form-label">Отрасль</label>
          <select id="regEmployerIndustry" v-model="employerForm.industry" class="form-select">
            <option>IT</option>
            <option>Маркетинг</option>
            <option>Финансы</option>
            <option>Продажи</option>
          </select>
        </div>
        <button type="submit" class="btn btn-success w-100 mb-2" :disabled="loading">
          {{ loading ? 'Регистрация...' : 'Зарегистрировать компанию' }}
        </button>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useNotifications } from '@/composables/useNotifications'

const props = defineProps({
  activeTab: {
    type: String,
    default: 'candidate'
  }
})

const router = useRouter()
const { register, login, loading } = useAuth()
const { success, error: showError } = useNotifications()

const candidateForm = ref({
  name: '',
  email: '',
  password: '',
  position: '',
  city: 'Москва'
})

const employerForm = ref({
  companyName: '',
  email: '',
  password: '',
  industry: 'IT',
  city: 'Москва'
})

const handleSubmit = async (role) => {
  try {
    const formData = role === 'candidate' ? candidateForm.value : employerForm.value
    await register({
      ...formData,
      role
    })
    
    success('Регистрация успешна! Выполняется вход...')
    
    setTimeout(async () => {
      try {
        await login(formData.email, formData.password, role)
        if (role === 'candidate') {
          router.push('/dashboard/user')
        } else {
          router.push('/dashboard/employer')
        }
      } catch (err) {
        showError(err.message || 'Ошибка входа')
      }
    }, 1000)
  } catch (err) {
    showError(err.message || 'Ошибка регистрации')
  }
}
</script>

