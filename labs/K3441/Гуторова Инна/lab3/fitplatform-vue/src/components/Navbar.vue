<script setup>
import { ref, computed } from 'vue'
import { useApi } from '@/composables/useApi'
import { useAuth } from '@/composables/useAuth'

const api = useApi()
const { user, token, login: setAuth, logout: doLogout } = useAuth()

const showLogin = ref(false)
const showRegister = ref(false)

const loginEmail = ref('')
const loginPassword = ref('')

const regName = ref('')
const regEmail = ref('')
const regPassword = ref('')
const regConfirm = ref('')

const loginError = ref('')
const registerError = ref('')

const isAuthenticated = computed(() => !!token.value)

async function login() {
  loginError.value = ''
  try {
    const res = await api.post('/login', { email: loginEmail.value, password: loginPassword.value })
    setAuth(res.data)
    showLogin.value = false
    loginEmail.value = ''
    loginPassword.value = ''
  } catch (err) {
    loginError.value = err.response?.data || err.message
  }
}

async function register() {
  registerError.value = ''
  if (regPassword.value !== regConfirm.value) {
    registerError.value = 'Пароли не совпадают'
    return
  }
  if (regPassword.value.length < 8) {
    registerError.value = 'Пароль минимум 8 символов'
    return
  }
  try {
    const res = await api.post('/register', { name: regName.value, email: regEmail.value, password: regPassword.value })
    showRegister.value = false
    regName.value = ''
    regEmail.value = ''
    regPassword.value = ''
    regConfirm.value = ''
  } catch (err) {
    registerError.value = err.response?.data || err.message
  }
}

function logout() {
  doLogout()
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm">
    <div class="container">
      <a class="navbar-brand"><router-link class="nav-link" to="/">FitPlatform</router-link></a>
      <button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navMain">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navMain">
        <ul class="navbar-nav me-auto">
          <li class="nav-item"><router-link class="nav-link" to="/workouts">Тренировки</router-link></li>
          <li class="nav-item"><router-link class="nav-link" to="/blog">Блог</router-link></li>
          <li v-if="isAuthenticated" class="nav-item"><router-link class="nav-link" to="/profile">Личный кабинет</router-link></li>
        </ul>
        <div class="d-flex">
          <button v-if="!isAuthenticated" class="btn btn-outline-primary me-2" @click="showLogin = true">Вход</button>
          <button v-if="!isAuthenticated" class="btn btn-primary" @click="showRegister = true">Регистрация</button>
          <button v-if="isAuthenticated" class="btn btn-danger" @click="logout">Выход</button>
        </div>
      </div>
    </div>

    <!-- Модалки -->
    <div v-if="showLogin" class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <form class="modal-content" @submit.prevent="login">
          <div class="modal-header">
            <h5 class="modal-title">Вход</h5>
            <button type="button" class="btn-close" @click="showLogin = false"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" v-model="loginEmail" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Пароль</label>
              <input type="password" class="form-control" v-model="loginPassword" required>
            </div>
            <div v-if="loginError" class="text-danger">{{ loginError }}</div>
          </div>
          <div class="modal-footer d-flex justify-content-between">
            <button type="button" class="btn btn-link" @click="showRegister = true; showLogin = false">Регистрация</button>
            <button type="submit" class="btn btn-primary">Войти</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showRegister" class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <form class="modal-content" @submit.prevent="register">
          <div class="modal-header">
            <h5 class="modal-title">Регистрация</h5>
            <button type="button" class="btn-close" @click="showRegister = false"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Имя</label>
              <input type="text" class="form-control" v-model="regName" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" v-model="regEmail" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Пароль</label>
              <input type="password" class="form-control" v-model="regPassword" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Подтверждение пароля</label>
              <input type="password" class="form-control" v-model="regConfirm" required>
            </div>
            <div v-if="registerError" class="text-danger">{{ registerError }}</div>
          </div>
          <div class="modal-footer d-flex justify-content-between">
            <button type="button" class="btn btn-link" @click="showLogin = true; showRegister = false">Вход</button>
            <button type="submit" class="btn btn-primary">Зарегистрироваться</button>
          </div>
        </form>
      </div>
    </div>
  </nav>
</template>
