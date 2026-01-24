<template>
  <div class="app-container">
    <nav class="navbar navbar-expand-lg navbar-dark bg-success mb-4">
      <div class="container">
        <router-link to="/" class="navbar-brand">Книга рецептов</router-link>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">          
          <div class="navbar-nav ms-auto">
            <template v-if="userStore.isAuthenticated">
              <li class="nav-item">
                <span class="nav-link">Привет, {{ userStore.user?.name }}</span>
              </li>
              <li class="nav-item">
                <button class="btn btn-outline-light me-2" @click="handleLogout">
                  Выйти
                </button>
              </li>
            </template>
            <template v-else>
                <router-link to="/login" class="btn btn-outline-light me-2">Вход</router-link>
                <router-link to="/register" class="btn btn-outline-light me-2">
                  Регистрация
                </router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- основной контент -->
    <main class="container my-4">
      <slot />
    </main>

    <footer class="bg-light text-center text-lg-start mt-5">
      <div class="container p-4">
        <div class="row">
          <div class="col-lg-12 text-center">
            <p>© Книга рецептов. Курс "Фронтэнд-разработка". Университет ИТМО, 2025</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}
</style>