<template>
  <base-layout>
    <header class="mb-3">
      <nav class="navbar navbar-dark">
        <div class="container">
          <RouterLink to="/profile" class="text-white d-flex align-items-center">
            <i class="bi bi-arrow-left-circle me-1" aria-hidden="true"></i>
            Назад к профилю
          </RouterLink>
        </div>
      </nav>
    </header>

    <main class="profile-container">
      <section class="info-card">
        <h2 class="visually-hidden">Редактирование профиля</h2>
        <form @submit.prevent="submitProfile">
          <div class="mb-3">
            <label class="form-label" for="nameInput">Имя</label>
            <input
              type="text"
              id="nameInput"
              class="form-control"
              v-model="user.name"
              required
            >
          </div>
          <div class="mb-3">
            <label class="form-label" for="emailInput">Электронная почта</label>
            <input
              type="email"
              id="emailInput"
              class="form-control"
              v-model="user.email"
              required
            >
          </div>
          <div class="mb-3">
            <label class="form-label" for="avatarInput">Фото профиля</label>
            <input
              id="avatarInput"
              type="file"
              class="form-control"
              @change="onAvatarChange"
            >
            <div class="form-text">Выберите изображение для аватара (необязательно)</div>
            <img v-if="user.avatar" :src="user.avatar" alt="Аватар" class="mt-2 rounded" style="width: 100px; height: 100px;">
          </div>
          <button type="submit" class="btn btn-primary me-2">Сохранить изменения</button>
          <RouterLink to="/profile" class="btn btn-secondary">Отмена</RouterLink>
        </form>
      </section>
    </main>
  </base-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseLayout from '@/layouts/BaseLayout.vue'
import { RouterLink } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const API_URL = 'http://localhost:3000'

const token = localStorage.getItem('token')
const userId = localStorage.getItem('userId')

if (!token || !userId) {
  router.push('/login')
}

const user = ref({ name: '', email: '', avatar: null })
let currentAvatar = null
let avatarFile = null

onMounted(async () => {
  try {
    const res = await axios.get(`${API_URL}/users/${userId}`)
    user.value = res.data
    currentAvatar = res.data.avatar || null
  } catch (e) {
    console.error('Ошибка загрузки профиля', e)
  }
})

const onAvatarChange = (e) => {
  avatarFile = e.target.files[0] || null
  if (avatarFile) {
    const reader = new FileReader()
    reader.onload = () => {
      user.value.avatar = reader.result
    }
    reader.readAsDataURL(avatarFile)
  } else {
    user.value.avatar = currentAvatar
  }
}

const submitProfile = async () => {
  try {
    await axios.patch(`${API_URL}/users/${userId}`, user.value, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    router.push('/profile')
  } catch (e) {
    console.error('Ошибка сохранения профиля', e)
    alert('Не удалось сохранить профиль')
  }
}
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 0 auto;
}
</style>
