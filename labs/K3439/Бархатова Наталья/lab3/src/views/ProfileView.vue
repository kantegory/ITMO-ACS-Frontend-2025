<template>
  <base-layout>
    <header>
      <nav class="navbar navbar-dark mb-3">
        <div class="container d-flex align-items-center">
          <RouterLink to="/restaurants" class="navbar-brand">
            ← Назад к списку ресторанов
          </RouterLink>
        </div>
      </nav>
    </header>

    <main class="container profile-container" v-if="user">
      <section class="d-flex align-items-center mb-4">
        <img
          :src="user.avatar || defaultAvatar"
          alt="Аватар пользователя"
          class="profile-avatar me-4"
        />
        <div>
          <div class="profile-name">{{ user.name }}</div>
          <div class="text-muted mt-1">{{ user.email }}</div>
        </div>
      </section>

      <section class="info-card mb-3">
        <h2 class="info-title">Актуальные бронирования</h2>
        <ul class="list-unstyled mb-0">
          <li v-for="b in upcomingBookings" :key="b.id">
            {{ b.restaurantName }} — {{ b.date }} / {{ b.time }}
          </li>
          <li v-if="!upcomingBookings.length" class="text-muted">Нет актуальных бронирований</li>
        </ul>
      </section>

      <section class="info-card mb-3">
        <h2 class="info-title">История бронирований</h2>
        <ul class="list-unstyled mb-0">
          <li v-for="b in pastBookings" :key="b.id">
            {{ b.restaurantName }} — {{ b.date }} / {{ b.time }}
          </li>
          <li v-if="!pastBookings.length" class="text-muted">Нет прошлых бронирований</li>
        </ul>
      </section>

      <div class="mt-3 d-flex gap-2 align-items-center flex-wrap">
        <RouterLink to="/profile/edit" class="btn btn-primary d-flex align-items-center">
          Изменить данные
        </RouterLink>

        <RouterLink to="/password-recovery" class="btn btn-primary d-flex align-items-center">
          Сменить пароль
        </RouterLink>

        <button class="btn btn-outline-secondary" @click="toggleTheme">
          {{ theme === 'light' ? 'Тёмная тема' : 'Светлая тема' }}
        </button>
      </div>
    </main>
  </base-layout>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import BaseLayout from '@/layouts/BaseLayout.vue'
import { useProfileStore } from '@/stores/profile'
import { useThemeStore } from '@/stores/themeStore'

const router = useRouter()
const profileStore = useProfileStore()
const themeStore = useThemeStore()

const defaultAvatar = '/images/icon.png'
const userId = localStorage.getItem('userId')

const theme = computed(() => themeStore.theme)
const toggleTheme = () => themeStore.toggleTheme()

onMounted(async () => {
  themeStore.initTheme()
  if (!userId) {
    router.push('/login')
    return
  }

  try {
    await profileStore.loadProfile(userId)
  } catch (error) {
    console.error('Ошибка загрузки профиля:', error)
    router.push('/login')
  }
})

const user = computed(() => profileStore.user)
const upcomingBookings = computed(() => profileStore.upcomingBookings)
const pastBookings = computed(() => profileStore.pastBookings)
</script>
