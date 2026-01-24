<template>
  <div id="app">
    <AppHeader 
      @show-login="showLoginModal"
      @show-register="showRegisterModal"
    />
    <RouterView />
    <LoginModal ref="loginModal" @login-success="handleAuthSuccess" />
    <RegisterModal ref="registerModal" @register-success="handleAuthSuccess" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import LoginModal from './components/LoginModal.vue'
import RegisterModal from './components/RegisterModal.vue'

const loginModal = ref<InstanceType<typeof LoginModal>>()
const registerModal = ref<InstanceType<typeof RegisterModal>>()

const showLoginModal = () => {
  loginModal.value?.show()
}

const showRegisterModal = () => {
  registerModal.value?.show()
}

const handleAuthSuccess = () => {
  // Could add additional logic here if needed
}
</script>

<style>
#app {
  min-height: 100vh;
}
</style>
