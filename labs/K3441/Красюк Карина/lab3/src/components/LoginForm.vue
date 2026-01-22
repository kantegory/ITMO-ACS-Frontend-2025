<template>
  <div class="tab-content" id="pills-tabContent">
    <section
      class="tab-pane fade"
      :class="{ 'show active': activeTab === 'candidate' }"
      id="candidate"
      role="tabpanel"
    >
      <form @submit.prevent="handleSubmit('candidate')" class="needs-validation" novalidate aria-label="Форма входа для соискателя">
        <div class="mb-3">
          <label for="candidateEmail" class="form-label">E-mail</label>
          <input
            type="email"
            id="candidateEmail"
            v-model="form.email"
            class="form-control"
            required
            aria-required="true"
          >
          <div class="invalid-feedback">Введите корректный e-mail.</div>
        </div>
        <div class="mb-3">
          <label for="candidatePassword" class="form-label">Пароль</label>
          <input
            type="password"
            id="candidatePassword"
            v-model="form.password"
            class="form-control"
            required
            minlength="6"
            aria-required="true"
          >
          <div class="invalid-feedback">Введите пароль (минимум 6 символов).</div>
        </div>
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="rememberCandidate" v-model="form.remember">
            <label class="form-check-label" for="rememberCandidate">Запомнить меня</label>
          </div>
          <a href="#" class="small link-secondary text-decoration-none" @click.prevent="showResetModal = true">
            Забыли пароль?
          </a>
        </div>
        <button type="submit" class="btn btn-primary w-100 mb-3" :disabled="loading">
          {{ loading ? 'Вход...' : 'Войти в личный кабинет' }}
        </button>
      </form>
    </section>

    <section
      class="tab-pane fade"
      :class="{ 'show active': activeTab === 'employer' }"
      id="employer"
      role="tabpanel"
    >
      <form @submit.prevent="handleSubmit('employer')" class="needs-validation" novalidate aria-label="Форма входа для работодателя">
        <div class="mb-3">
          <label for="employerEmail" class="form-label">E-mail компании</label>
          <input
            type="email"
            id="employerEmail"
            v-model="form.email"
            class="form-control"
            required
            aria-required="true"
          >
          <div class="invalid-feedback">Введите корректный e-mail.</div>
        </div>
        <div class="mb-3">
          <label for="employerPassword" class="form-label">Пароль</label>
          <input
            type="password"
            id="employerPassword"
            v-model="form.password"
            class="form-control"
            required
            minlength="6"
            aria-required="true"
          >
          <div class="invalid-feedback">Введите пароль (минимум 6 символов).</div>
        </div>
        <button type="submit" class="btn btn-success w-100 mb-3" :disabled="loading">
          {{ loading ? 'Вход...' : 'Войти как работодатель' }}
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
const { login, loading } = useAuth()
const { success, error: showError } = useNotifications()

const form = ref({
  email: '',
  password: '',
  remember: false
})

const showResetModal = ref(false)

const handleSubmit = async (role) => {
  try {
    await login(form.value.email, form.value.password, role)
    success('Успешный вход!')
    if (role === 'candidate') {
      router.push('/dashboard/user')
    } else {
      router.push('/dashboard/employer')
    }
  } catch (err) {
    showError(err.message || 'Ошибка входа')
  }
}
</script>

