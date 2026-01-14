<template>
  <div class="page">
    <header class="page__header">
      <nav class="navbar" aria-label="Основная навигация">
        <div class="container d-flex align-items-center justify-content-between gap-3">
          <router-link class="navbar-brand fw-bold d-flex align-items-center gap-2" to="/">
            <svg class="icon icon--lg" aria-hidden="true" focusable="false">
              <use href="/sprite.svg#icon-briefcase"></use>
            </svg>
            <span>JobBridge</span>
          </router-link>
          <div class="d-flex align-items-center flex-wrap gap-3">
            <ul class="navbar-nav flex-row gap-3 mb-0">
              <li class="nav-item">
                <router-link class="nav-link" to="/jobs">Вакансии</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/favorites">Избранное</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/profile">Соискатель</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/employer">Работодатель</router-link>
              </li>
            </ul>
            <div class="d-flex align-items-center gap-2">
              <button
                v-if="!user"
                class="btn btn-outline-light btn-sm"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#loginModal"
              >
                Вход
              </button>
              <button
                v-if="!user"
                class="btn btn-warning btn-sm"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#registerModal"
              >
                Регистрация
              </button>
              <button
                v-if="user"
                class="btn btn-outline-light btn-sm"
                type="button"
                @click="logout"
              >
                Выйти
              </button>
            </div>
            <theme-toggle />
          </div>
        </div>
      </nav>
    </header>

    <main class="page__content" role="main">
      <slot />
    </main>

    <footer class="page__footer">
      <div class="container d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div>
          <strong>JobBridge</strong>
        </div>
        <div class="d-flex gap-2">
          <router-link class="btn btn-outline-light btn-sm minw-140" to="/jobs">
            К вакансиям
          </router-link>
          <router-link class="btn btn-light btn-sm minw-140" to="/profile">
            Мой профиль
          </router-link>
        </div>
      </div>
    </footer>

    <div
      class="modal fade"
      id="loginModal"
      tabindex="-1"
      aria-labelledby="loginModalTitle"
      aria-hidden="true"
      role="dialog"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="loginModalTitle">Вход</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitLogin">
              <div class="mb-3">
                <label class="form-label" for="loginEmail">E-mail</label>
                <input
                  id="loginEmail"
                  v-model="loginForm.email"
                  type="email"
                  class="form-control"
                  autocomplete="email"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label" for="loginPassword">Пароль</label>
                <input
                  id="loginPassword"
                  v-model="loginForm.password"
                  type="password"
                  class="form-control"
                  autocomplete="current-password"
                  required
                />
              </div>
              <button class="btn btn-primary w-100" type="submit">Войти</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div
      class="modal fade"
      id="registerModal"
      tabindex="-1"
      aria-labelledby="registerModalTitle"
      aria-hidden="true"
      role="dialog"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="registerModalTitle">Регистрация</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitRegister">
              <div class="mb-3">
                <label class="form-label" for="registerName">Имя</label>
                <input
                  id="registerName"
                  v-model="registerForm.fullName"
                  type="text"
                  class="form-control"
                  autocomplete="name"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label" for="registerEmail">E-mail</label>
                <input
                  id="registerEmail"
                  v-model="registerForm.email"
                  type="email"
                  class="form-control"
                  autocomplete="email"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label" for="registerPassword">Пароль</label>
                <input
                  id="registerPassword"
                  v-model="registerForm.password"
                  type="password"
                  class="form-control"
                  autocomplete="new-password"
                  required
                />
              </div>
              <button class="btn btn-warning w-100" type="submit">Создать аккаунт</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { useJobsStore } from '@/stores/jobs'

export default {
  name: 'MainLayout',
  components: { ThemeToggle },
  data() {
    return {
      loginForm: {
        email: '',
        password: '',
      },
      registerForm: {
        fullName: '',
        email: '',
        password: '',
      },
    }
  },
  computed: {
    user() {
      return useJobsStore().user
    },
  },
  methods: {
    async submitLogin() {
      const store = useJobsStore()
      try {
        await store.login({
          email: this.loginForm.email,
          password: this.loginForm.password,
        })
        this.loginForm.email = ''
        this.loginForm.password = ''
        const modal = Modal.getInstance(document.getElementById('loginModal'))
        modal?.hide()
      } catch (error) {
        alert('Ошибка авторизации.')
      }
    },
    async submitRegister() {
      const store = useJobsStore()
      try {
        await store.register({
          fullName: this.registerForm.fullName,
          email: this.registerForm.email,
          password: this.registerForm.password,
        })
        this.registerForm.fullName = ''
        this.registerForm.email = ''
        this.registerForm.password = ''
        const modal = Modal.getInstance(document.getElementById('registerModal'))
        modal?.hide()
      } catch (error) {
        alert('Ошибка регистрации.')
      }
    },
    logout() {
      const store = useJobsStore()
      store.logout()
    },
  },
}
</script>
