<template>
  <section class="page-section" aria-labelledby="login-title">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card p-4">
          <h2 class="card-title text-center text-primary mb-4 fw-bold" id="login-title">Вход в FitLife</h2>
          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label for="loginEmail" class="form-label">Email адрес</label>
              <input type="email" class="form-control" id="loginEmail" v-model="form.email" placeholder="name@example.com" required>
            </div>
            <div class="mb-3">
              <label for="loginPassword" class="form-label">Пароль</label>
              <input type="password" class="form-control" id="loginPassword" v-model="form.password" placeholder="••••••••" required>
            </div>
            <div class="d-grid gap-2">
              <button type="submit" class="btn btn-primary" :disabled="loading">
                {{ loading ? 'Загрузка...' : 'Войти' }}
              </button>
            </div>
            <p class="text-center mt-3">
              Нет аккаунта? <router-link to="/register">Зарегистрироваться</router-link>
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '../composables/useApi'
import { useNotification } from '../composables/useNotification'

export default {
  name: 'LoginPage',
  setup() {
    const router = useRouter()
    const { get } = useApi()
    const { showSuccess, showError } = useNotification()
    const form = ref({
      email: '',
      password: ''
    })
    const loading = ref(false)

    const handleLogin = async () => {
      try {
        loading.value = true
        const users = await get(`/users?email=${form.value.email}`)
        
        if (users.length === 1 && users[0].password === form.value.password) {
          const user = users[0]
          localStorage.setItem('userName', user.name)
          localStorage.setItem('userId', user.id)
          
          showSuccess(`Привет, ${user.name}! Вы успешно вошли в систему.`, { name: 'dashboard' })
          form.value.email = ''
          form.value.password = ''
        } else {
          showError('Ошибка входа', 'Неверный email или пароль.')
        }
      } catch (error) {
        console.error('Ошибка при входе:', error)
        showError('Ошибка сети', 'Не удалось подключиться к API.')
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      loading,
      handleLogin
    }
  }
}
</script>