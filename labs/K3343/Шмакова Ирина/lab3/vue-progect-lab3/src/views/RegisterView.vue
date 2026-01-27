<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="text-center">Регистрация</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleRegister">
              <div class="mb-3">
                <label for="name" class="form-label">Имя</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="name"
                  v-model="form.name"
                  required
                >
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input 
                  type="email" 
                  class="form-control" 
                  id="email"
                  v-model="form.email"
                  required
                >
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Пароль</label>
                <input 
                  type="password" 
                  class="form-control" 
                  id="password"
                  v-model="form.password"
                  required
                >
              </div>
              <button type="submit" class="btn btn-success w-100">Зарегистрироваться</button>
            </form>
            <div class="mt-3 text-center">
              <router-link to="/login">Уже есть аккаунт? Войти</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const form = ref({
  name: '',
  email: '',
  password: ''
})

const handleRegister = async () => {
  // Здесь будет логика регистрации
  userStore.login({
    email: form.value.email,
    name: form.value.name
  }, 'fake-token')
  
  router.push('/')
}
</script>
