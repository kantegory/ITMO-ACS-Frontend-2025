<template>
  <section class="section-padding">
    <div class="container">
      <div class="row g-4">
        <div class="col-lg-6">
          <div class="glass-panel p-4 h-100">
            <p class="eyebrow">Вход</p>
            <h3 class="mb-3">Продолжить как соискатель или работодатель</h3>
            <form @submit.prevent="handleLogin" class="row g-3">
              <div class="col-12">
                <label class="form-label" for="loginEmail">Email</label>
                <input
                  type="email"
                  class="form-control"
                  id="loginEmail"
                  v-model="loginForm.email"
                  autocomplete="email"
                  required
                />
              </div>
              <div class="col-12">
                <label class="form-label" for="loginPassword">Пароль</label>
                <input
                  type="password"
                  class="form-control"
                  id="loginPassword"
                  v-model="loginForm.password"
                  autocomplete="current-password"
                  required
                />
              </div>
              <div class="col-12 d-flex gap-3 align-items-center">
                <label class="form-label visually-hidden" for="loginRole">Роль</label>
                <select class="form-select" id="loginRole" v-model="loginForm.role">
                  <option value="job_seeker">Соискатель</option>
                  <option value="employer">Работодатель</option>
                </select>
                <button class="btn btn-primary flex-grow-1" type="submit">Войти</button>
              </div>
              <div v-if="loginError" class="col-12">
                <div class="alert alert-danger">{{ loginError }}</div>
              </div>
            </form>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="glass-panel p-4 h-100">
            <p class="eyebrow">Регистрация</p>
            <h3 class="mb-3">Создать аккаунт</h3>
            <form @submit.prevent="handleRegister" class="row g-3">
              <div class="col-md-6">
                <label class="form-label" for="regFirstName">Имя</label>
                <input
                  type="text"
                  class="form-control"
                  id="regFirstName"
                  v-model="registerForm.firstName"
                  autocomplete="given-name"
                  required
                />
              </div>
              <div class="col-md-6">
                <label class="form-label" for="regLastName">Фамилия</label>
                <input
                  type="text"
                  class="form-control"
                  id="regLastName"
                  v-model="registerForm.lastName"
                  autocomplete="family-name"
                  required
                />
              </div>
              <div class="col-12">
                <label class="form-label" for="regEmail">Email</label>
                <input
                  type="email"
                  class="form-control"
                  id="regEmail"
                  v-model="registerForm.email"
                  autocomplete="email"
                  required
                />
              </div>
              <div class="col-12">
                <label class="form-label" for="regPassword">Пароль</label>
                <input
                  type="password"
                  class="form-control"
                  id="regPassword"
                  v-model="registerForm.password"
                  autocomplete="new-password"
                  required
                />
              </div>
              <div class="col-12 d-flex gap-3 flex-wrap">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="regRole"
                    id="roleSeeker"
                    value="job_seeker"
                    v-model="registerForm.role"
                    checked
                  />
                  <label class="form-check-label" for="roleSeeker">Соискатель</label>
                </div>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="regRole"
                    id="roleEmployer"
                    value="employer"
                    v-model="registerForm.role"
                  />
                  <label class="form-check-label" for="roleEmployer">Работодатель</label>
                </div>
                <button class="btn btn-contrast ms-auto" type="submit">Зарегистрироваться</button>
              </div>
              <div v-if="registerError" class="col-12">
                <div class="alert alert-danger">{{ registerError }}</div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useJobsStore } from '@/stores/jobs'

const router = useRouter()
const store = useJobsStore()

const loginForm = reactive({
  email: '',
  password: '',
  role: 'job_seeker',
})

const registerForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: 'job_seeker',
})

const loginError = ref('')
const registerError = ref('')

const handleLogin = async () => {
  loginError.value = ''
  if (!loginForm.email || !loginForm.password) {
    loginError.value = 'Введите email и пароль.'
    return
  }
  try {
    await store.login({ ...loginForm })
    loginForm.email = ''
    loginForm.password = ''
    router.push('/jobs')
  } catch (error) {
    const status = error?.response?.status
    if (status === 401) {
      loginError.value = 'Неверный логин или пароль.'
    } else if (error?.code === 'ERR_NETWORK' || error?.message?.includes('ERR_CONNECTION_REFUSED')) {
      loginError.value = 'Сервер недоступен. Проверьте, что бэкенд запущен на http://localhost:3001'
    } else {
      loginError.value = 'Ошибка авторизации. Попробуйте позже.'
    }
  }
}

const handleRegister = async () => {
  registerError.value = ''
  const fullName = `${registerForm.firstName} ${registerForm.lastName}`.trim()
  const username =
    (registerForm.email.split('@')[0] || 'user').replace(/[^a-zA-Z0-9_.-]/g, '') || `user${Date.now()}`

  if (!registerForm.email || !registerForm.password || !fullName) {
    registerError.value = 'Заполните имя, фамилию, email и пароль.'
    return
  }

  try {
    await store.register({
      email: registerForm.email,
      password: registerForm.password,
      fullName,
      username,
      role: registerForm.role,
    })
    registerForm.firstName = ''
    registerForm.lastName = ''
    registerForm.email = ''
    registerForm.password = ''
    router.push('/jobs')
  } catch (error) {
    const status = error?.response?.status
    if (status === 409) {
      registerError.value = 'Такой email или username уже заняты.'
    } else if (error?.code === 'ERR_NETWORK' || error?.message?.includes('ERR_CONNECTION_REFUSED')) {
      registerError.value = 'Сервер недоступен. Проверьте, что бэкенд запущен на http://localhost:3001'
    } else {
      registerError.value = 'Ошибка регистрации. Попробуйте позже.'
    }
  }
}
</script>
