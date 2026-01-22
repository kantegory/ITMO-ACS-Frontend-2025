<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-5">
        <div class="card shadow">
          <div class="card-body p-5">
            <h2 class="text-center mb-4">Регистрация</h2>
            
            <div v-if="error" class="alert alert-danger">{{ error }}</div>
            <div v-if="success" class="alert alert-success">Регистрация успешна! Войдите в систему.</div>
            
            <form @submit.prevent="handleRegister">
              <div class="mb-3">
                <label class="form-label">Имя</label>
                <input v-model="form.name" type="text" class="form-control" required>
              </div>
              
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input v-model="form.email" type="email" class="form-control" required>
              </div>
              
              <div class="mb-3">
                <label class="form-label">Телефон</label>
                <input v-model="form.phone" type="tel" class="form-control" required>
              </div>
              
              <div class="mb-3">
                <label class="form-label">Пароль</label>
                <input v-model="form.password" type="password" class="form-control" required minlength="6">
              </div>
              
              <button type="submit" class="btn btn-primary w-100 mb-3">Зарегистрироваться</button>
            </form>
            
            <p class="text-center mb-0">
              Уже есть аккаунт? 
              <router-link to="/login">Войдите</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { register, error } = useAuth()

const form = ref({
  name: '',
  email: '',
  phone: '',
  password: ''
})

const success = ref(false)

const handleRegister = async () => {
  try {
    await register(form.value)
    success.value = true
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (err) {
    console.error('Ошибка регистрации:', err)
  }
}
</script>
