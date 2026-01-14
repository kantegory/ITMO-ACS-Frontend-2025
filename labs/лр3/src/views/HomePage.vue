<template>
  <BaseLayout>
    <nav class="navbar navbar-transparent mb-4">
      <div class="container-fluid justify-content-center">
        <span class="navbar-brand elegant-title">Fitness Platform</span>
      </div>
    </nav>
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <div class="text-center mb-4">
          <div class="d-flex justify-content-center gap-3">
            <button v-if="!isAuthenticated" class="btn btn-primary-elegant btn-lg" @click="showLogin">Login</button>
            <button v-if="!isAuthenticated" class="btn btn-secondary-elegant btn-lg" @click="showRegister">Register</button>
            <router-link v-if="isAuthenticated" to="/workouts" class="btn btn-primary-elegant btn-lg">Start Training</router-link>
            <router-link v-if="isAuthenticated" to="/profile" class="btn btn-secondary-elegant btn-lg">My Profile</router-link>
          </div>
        </div>
        <div class="row g-4">
          <div class="col-md-4"><QuickAccessCard /></div>
          <div class="col-md-8">
            <figure class="photo-container">
              <img src="/workout.jpg" alt="Workout" class="img-fluid rounded-lg elegant-image" style="width: 100%;" @error="handleImageError">
            </figure>
          </div>
        </div>
      </div>
    </div>
    <LoginModal ref="loginModal" @switch-to-register="switchToRegister" />
    <RegisterModal ref="registerModal" @switch-to-login="switchToLogin" />
  </BaseLayout>
</template>

<script>
import { ref } from 'vue'
import BaseLayout from '@/layouts/BaseLayout.vue'
import QuickAccessCard from '@/components/home/QuickAccessCard.vue'
import LoginModal from '@/components/auth/LoginModal.vue'
import RegisterModal from '@/components/auth/RegisterModal.vue'
import { useAuth } from '@/composables/useAuth'

export default {
  name: 'HomePage',
  components: { BaseLayout, QuickAccessCard, LoginModal, RegisterModal },
  setup() {
    const { isAuthenticated } = useAuth()
    const loginModal = ref(null)
    const registerModal = ref(null)
    const showLogin = () => loginModal.value?.show()
    const showRegister = () => registerModal.value?.show()
    const switchToRegister = () => { loginModal.value?.hide(); setTimeout(() => registerModal.value?.show(), 300) }
    const switchToLogin = () => { registerModal.value?.hide(); setTimeout(() => loginModal.value?.show(), 300) }
    const handleImageError = (e) => { e.target.src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=400&fit=crop' }
    return { isAuthenticated, loginModal, registerModal, showLogin, showRegister, switchToRegister, switchToLogin, handleImageError }
  }
}
</script>
