<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-5">
        <div class="card shadow">
          <div class="card-body p-5">
            <h2 class="text-center mb-4">Вход</h2>
            
            <div v-if="error" class="alert alert-danger">{{ error }}</div>
            
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input v-model="form.email" type="email" class="form-control" required>
              </div>
              
              <div class="mb-3">
                <label class="form-label">Пароль</label>
                <input v-model="form.password" type="password" class="form-control" required>
              </div>
              
              <button type="submit" class="btn btn-primary w-100 mb-3">Войти</button>
            </form>
            
            <p class="text-center mb-0">
              Нет аккаунта? 
              <router-link to="/register">Зарегистрируйтесь</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'

const { login, error } = useAuth()

const form = ref({
  email: '',
  password: ''
})

const handleLogin = async () => {
  try {
    await login(form.value.email, form.value.password)
  } catch (err) {
    console.error('Ошибка входа:', err)
  }
}
</script>
