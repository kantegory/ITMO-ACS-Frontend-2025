<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <router-link class="navbar-brand" to="/">Кулинарный Блог</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Главная</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/recipes">Рецепты</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/blogs">Блоги</router-link>
            </li>
          </ul>
          <div class="d-flex">
            <div v-if="isAuthenticated" id="userMenu">
              <router-link class="btn btn-outline-light me-2" to="/profile">Профиль</router-link>
              <button class="btn btn-danger" @click="handleLogout">Выход</button>
            </div>
            <div v-else id="authButtons">
              <router-link class="btn btn-outline-light me-2" to="/login">Вход</router-link>
              <router-link class="btn btn-warning" to="/register">Регистрация</router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main class="container mt-4">
      <router-view />
    </main>
  </div>
</template>

<script>
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from './composables/useApi'

export default {
  name: 'App',
  setup() {
    const isAuthenticated = ref(false)
    const router = useRouter()
    const { logout, getCurrentUser } = useApi()

    const checkAuth = async () => {
      try {
        const user = await getCurrentUser()
        isAuthenticated.value = !!user
      } catch {
        isAuthenticated.value = false
      }
    }

    const handleLogout = () => {
      logout()
      isAuthenticated.value = false
      router.push('/')
    }

    watchEffect(() => {
      checkAuth()
    })

    return {
      isAuthenticated,
      handleLogout
    }
  }
}
</script>

<style>
.recipe-card {
  transition: transform 0.2s;
}

.recipe-card:hover {
  transform: translateY(-5px);
}

.nav-tabs .nav-link.active {
  background-color: #f8f9fa;
  border-bottom-color: #f8f9fa;
}

.comment-section {
  max-height: 300px;
  overflow-y: auto;
}

.login-container, .register-container {
  min-height: 80vh;
  display: flex;
  align-items: center;
}

.profile-header {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}
</style>