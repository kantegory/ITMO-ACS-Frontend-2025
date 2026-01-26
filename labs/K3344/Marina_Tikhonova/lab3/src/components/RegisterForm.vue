<template>
  <div class="card">
    <div class="card-header">
      <h3>Регистрация</h3>
    </div>
    <div class="card-body">
      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label for="registerName" class="form-label">Имя</label>
          <input v-model="name" type="text" class="form-control" id="registerName" required>
        </div>
        <div class="mb-3">
          <label for="registerEmail" class="form-label">Email</label>
          <input v-model="email" type="email" class="form-control" id="registerEmail" required>
        </div>
        <div class="mb-3">
          <label for="registerPassword" class="form-label">Пароль</label>
          <input v-model="password" type="password" class="form-control" id="registerPassword" required>
        </div>
        <div class="mb-3">
          <label for="confirmPassword" class="form-label">Подтверждение пароля</label>
          <input v-model="confirmPassword" type="password" class="form-control" id="confirmPassword" required>
        </div>
        <button type="submit" class="btn btn-success w-100">Зарегистрироваться</button>
      </form>
      <div class="mt-3">
        <p>Уже есть аккаунт? 
          <router-link to="/login">Войти</router-link>
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
  name: 'RegisterForm',
  emits: ['register'],
  setup(_, { emit }) {
    const name = ref('')
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const error = ref('')
    const router = useRouter()
    const { register } = useApi()

    const handleSubmit = async () => {
      if (password.value !== confirmPassword.value) {
        error.value = 'Пароли не совпадают'
        return
      }

      try {
        await register(name.value, email.value, password.value)
        emit('register')
        router.push('/')
      } catch (err) {
        error.value = err.message
      }
    }

    return {
      name,
      email,
      password,
      confirmPassword,
      error,
      handleSubmit
    }
  }
}
</script>