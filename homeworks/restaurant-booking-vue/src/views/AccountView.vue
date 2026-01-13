<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentUser = ref(null)

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('currentUser'))
  if (!user) router.push('/login')
  currentUser.value = user
})

function logout() {
  localStorage.removeItem('currentUser')
  router.push('/login')
}
</script>

<template>
  <div class="container mt-5" v-if="currentUser">
    <h2>Личный кабинет</h2>
    <p>Добро пожаловать, {{ currentUser.name }}!</p>
    <div class="mt-3">
      <button class="btn btn-primary me-2" @click="$router.push('/history')">История бронирований</button>
      <button class="btn btn-outline-danger" @click="logout">Выйти</button>
    </div>
  </div>
</template>
