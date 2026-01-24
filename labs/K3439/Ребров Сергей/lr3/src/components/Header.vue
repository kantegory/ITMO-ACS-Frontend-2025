<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link class="navbar-brand d-flex align-items-center" :to="{ name: 'Search' }">
        <svg class="icon me-2"><use xlink:href="../assets/imgs/sprite.svg#logo"></use></svg>
        <span>JobFinder</span>
      </router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav"
              aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="nav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'Search' }">Поиск</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'Profile' }">Аккаунт</router-link>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" @click.prevent="onLogout">Выйти</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { logout } = useAuth()

function onLogout() {
  logout()
  router.push({ name: 'Login' })
}
</script>

<style scoped>
.icon { width: 24px; height: 24px; }
</style>
