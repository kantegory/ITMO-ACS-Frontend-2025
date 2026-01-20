<template>
  <div>
    <svg aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">
      <symbol id="icon-globe" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"></circle>
        <path d="M3 12h18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"></path>
        <path
          d="M12 3c-2.5 3.2-2.5 14.8 0 18 2.5-3.2 2.5-14.8 0-18z"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
        ></path>
        <path
          d="M7 7c1.5 1 3.5 1.5 5 1.5S15.5 8 17 7M7 17c1.5-1 3.5-1.5 5-1.5S15.5 16 17 17"
          fill="none"
          stroke="currentColor"
          stroke-width="1.2"
          stroke-linecap="round"
        ></path>
      </symbol>
      <symbol id="icon-shield" viewBox="0 0 24 24">
        <path
          d="M12 21s7-3.5 7-10.5V6.8L12 3 5 6.8v3.7C5 17.5 12 21 12 21z"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M9.2 12.2 11 14l3.8-3.8"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </symbol>
      <symbol id="icon-chat" viewBox="0 0 24 24">
        <path
          d="M5 18.5 3 21l3.2-.8A10 10 0 1 0 5 18.5z"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path d="M8 10h8M8 13h5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"></path>
      </symbol>
      <symbol id="icon-bell" viewBox="0 0 24 24">
        <path
          d="M18 15v-3a6 6 0 0 0-12 0v3l-2 2h16l-2-2z"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M10 19a2 2 0 0 0 4 0"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
        ></path>
      </symbol>
      <symbol id="icon-rocket" viewBox="0 0 24 24">
        <path
          d="M14 4.5c2 0 4 .6 5.5 2.2a10 10 0 0 1-2.7 6.6l-4.6 4.7a2 2 0 0 1-1.4.6H9l-2.2 2.1-.3-2.8a2 2 0 0 1 .6-1.6l3.5-3.3C9 10.4 9.6 6.8 14 4.5z"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M13.4 9.8a1.6 1.6 0 1 0 2.3-2.2 1.6 1.6 0 0 0-2.3 2.2z"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M7.5 11.5 5 11a3.5 3.5 0 0 1 3.4-3M8.4 16.4l.5 2.5a3 3 0 0 1-3.5-3.4l2.4.9"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
        ></path>
      </symbol>
      <symbol id="icon-key" viewBox="0 0 24 24">
        <circle cx="9" cy="9" r="3.5" fill="none" stroke="currentColor" stroke-width="1.6"></circle>
        <path
          d="M12.1 12.1 20 20M16 16l-2.5 2.5M14.2 14.2 12 16.4"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </symbol>
    </svg>

    <a class="skip-link" href="#mainContent">Перейти к основному содержимому</a>

    <header class="topbar">
      <div class="container d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div class="brand d-flex align-items-center gap-2">
          <svg class="icon icon--lg" aria-hidden="true" focusable="false">
            <use href="#icon-globe"></use>
          </svg>
          <router-link to="/" style="text-decoration: none; color: inherit">
            <span>Career Atlas</span>
          </router-link>
        </div>
        <nav class="nav-links" aria-label="Разделы сайта">
          <router-link to="/auth">Вход / Регистрация</router-link>
          <router-link to="/candidate">ЛК соискателя</router-link>
          <router-link to="/jobs">Поиск вакансий</router-link>
          <router-link to="/employer">ЛК работодателя</router-link>
        </nav>
        <div class="d-flex align-items-center gap-2">
          <ThemeToggle />
          <div class="user-badge" :class="{ success: user, error: !user }">
            {{ user ? `Вы вошли: ${user.email || user.name || user.id}` : 'Не авторизован' }}
          </div>
        </div>
      </div>
    </header>

    <section class="hero text-white">
      <div class="container position-relative">
        <div class="row align-items-center g-4">
          <div class="col-lg-8">
            <p class="eyebrow text-uppercase mb-2">новая версия</p>
            <h1 class="display-5 fw-semibold mb-3">Платформа вакансий без шаблонных откликов</h1>
            <p class="lead text-white-75 mb-4">
              Вход, регистрация, личные кабинеты соискателя и работодателя, поиск с фильтрами и карточка вакансии —
              всё на одной странице.
            </p>
            <div class="d-flex flex-wrap gap-3">
              <router-link to="/auth" class="btn btn-primary d-inline-flex align-items-center gap-2">
                <svg class="icon" aria-hidden="true" focusable="false">
                  <use href="#icon-key"></use>
                </svg>
                Войти
              </router-link>
              <router-link to="/jobs" class="btn btn-contrast d-inline-flex align-items-center gap-2">
                <svg class="icon" aria-hidden="true" focusable="false">
                  <use href="#icon-chat"></use>
                </svg>
                Посмотреть вакансии
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <main id="mainContent" role="main">
      <slot />
    </main>

    <footer class="py-4">
      <div class="container d-flex flex-wrap justify-content-between align-items-center gap-2">
        <div>
          <strong>Career Atlas</strong>
          <p class="text-muted small mb-0">Делаем трудоустройство предсказуемым и честным.</p>
        </div>
        <div class="d-flex gap-3 align-items-center">
          <router-link to="/auth" class="text-muted small">Вход</router-link>
          <router-link to="/jobs" class="text-muted small">Вакансии</router-link>
          <a href="mailto:hello@career-atlas.io" class="text-muted small">hello@career-atlas.io</a>
          <span class="badge rounded-pill text-bg-success">online</span>
        </div>
      </div>
    </footer>

    <ApplicationModal ref="applicationModal" :vacancy="selectedVacancy" @submitted="handleApplicationSubmitted" />
  </div>
</template>

<script setup>
import { computed, ref, provide } from 'vue'
import { useRoute } from 'vue-router'
import { useJobsStore } from '@/stores/jobs'
import ThemeToggle from '@/components/ThemeToggle.vue'
import ApplicationModal from '@/components/ApplicationModal.vue'

const route = useRoute()
const store = useJobsStore()
const user = computed(() => store.user)
const selectedVacancy = ref(null)
const applicationModal = ref(null)

const showHero = computed(() => route.path === '/')

const handleApplicationSubmitted = () => {
  selectedVacancy.value = null
}

const openApplicationModal = (vacancy) => {
  selectedVacancy.value = vacancy
  if (applicationModal.value) {
    applicationModal.value.show()
  }
}

provide('openApplicationModal', openApplicationModal)
</script>
