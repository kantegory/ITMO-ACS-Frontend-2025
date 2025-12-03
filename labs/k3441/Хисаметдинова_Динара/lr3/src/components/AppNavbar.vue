<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-transparent position-absolute w-100" style="z-index: 1000;">
    <div class="container">
      <RouterLink class="navbar-brand fw-bold" to="/">
        <UshankaSvg class="navbar-logo me-2" width="32" height="32" />
        RentAparts
      </RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        @click="toggleNavbar"
        aria-label="Toggle navigation menu"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" :class="{ show: isNavbarOpen }" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/search">Search</RouterLink>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#destinations">Destinations</a>
          </li>
        </ul>
        <ul class="navbar-nav">
          <template v-if="isAuthenticated">
            <li class="nav-item">
              <RouterLink class="nav-link" to="/messages">Messages</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/profile">Profile</RouterLink>
            </li>
            <li class="nav-item">
              <button class="nav-link btn btn-link" @click="logout">Logout</button>
            </li>
          </template>
          <template v-else>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/login">Login</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/register">Register</RouterLink>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import UshankaSvg from '@/components/icons/UshankaSvg.vue'

const router = useRouter()
const authStore = useAuthStore()
const isNavbarOpen = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)

const toggleNavbar = () => {
  isNavbarOpen.value = !isNavbarOpen.value
}

const logout = async () => {
  await authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.navbar-logo {
  fill: white;
  transition: fill 0.3s ease;
}

[data-theme="light"] .navbar-logo {
  fill: black;
}

@media (prefers-color-scheme: light) {
  :root:not([data-theme="dark"]) .navbar-logo {
    fill: black;
  }
}

.nav-link.btn {
  background: none;
  border: none;
  color: inherit;
  padding: 0.5rem 1rem;
}

.nav-link.btn:hover {
  background: none;
  color: inherit;
  text-decoration: underline;
}
</style>