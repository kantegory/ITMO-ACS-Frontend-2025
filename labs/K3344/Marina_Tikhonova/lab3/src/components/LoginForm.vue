<template>
  <div class="card">
    <div class="card-header">
      <h3>Вход в аккаунт</h3>
    </div>
    <div class="card-body">
      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label for="loginEmail" class="form-label">Email</label>
          <input v-model="email" type="email" class="form-control" id="loginEmail" required>
        </div>
        <div class="mb-3">
          <label for="loginPassword" class="form-label">Пароль</label>
          <input v-model="password" type="password" class="form-control" id="loginPassword" required>
        </div>
        <button type="submit" class="btn btn-primary w-100">Войти</button>
      </form>
      <div class="mt-3">
        <p>Нет аккаунта? 
          <router-link to="/register">Зарегистрируйтесь</router-link>
        </p>
      </div>
      <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '../composables/useApi'

export default {
  name: 'LoginForm',
  emits: ['login'],
  setup(_, { emit }) {
    const email = ref('')
    const password = ref('')
    const error = ref('')
    const router = useRouter()
    const { login } = useApi()

    const handleSubmit = async () => {
      try {
        await login(email.value, password.value)
        emit('login')
        router.push('/')
      } catch (err) {
        error.value = err.message
      }
    }

    return {
      email,
      password,
      error,
      handleSubmit
    }
  }
}
</script>