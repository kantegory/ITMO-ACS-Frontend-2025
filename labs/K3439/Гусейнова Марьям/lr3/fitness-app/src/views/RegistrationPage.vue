<template>
  <section class="page-section" aria-labelledby="registration-title">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-7">
        <div class="card p-4">
          <h2 class="card-title text-center text-primary mb-4 fw-bold" id="registration-title">Создание Аккаунта</h2>
          <form @submit.prevent="handleRegistration">
            <div class="row g-3">
              <div class="col-md-6">
                <label for="regName" class="form-label">Имя</label>
                <input type="text" class="form-control" id="regName" v-model="form.name" placeholder="Иван" required>
              </div>
              <div class="col-md-6">
                <label for="regEmail" class="form-label">Email адрес</label>
                <input type="email" class="form-control" id="regEmail" v-model="form.email" placeholder="name@example.com" required>
              </div>
              <div class="col-md-6">
                <label for="regPassword" class="form-label">Пароль (минимум 6 символов)</label>
                <input type="password" class="form-control" id="regPassword" v-model="form.password" minlength="6" placeholder="••••••••" required>
              </div>
              <div class="col-md-6">
                <label for="regPasswordConfirm" class="form-label">Повторите пароль</label>
                <input type="password" class="form-control" id="regPasswordConfirm" v-model="form.passwordConfirm" placeholder="••••••••" required>
              </div>
            </div>
            <div class="form-check mt-3 mb-4">
              <input class="form-check-input" type="checkbox" id="termsCheck" v-model="form.terms" required>
              <label class="form-check-label" for="termsCheck">
                Согласен с условиями использования и политикой конфиденциальности.
              </label>
            </div>
            <div class="d-grid gap-2">
              <button type="submit" class="btn btn-primary" :disabled="loading">
                {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
              </button>
            </div>
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
  name: 'RegistrationPage',
  setup() {
    const router = useRouter()
    const { get, post } = useApi()
    const { showSuccess, showError } = useNotification()
    const form = ref({
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
      terms: false
    })
    const loading = ref(false)

    const handleRegistration = async () => {
      if (form.value.password !== form.value.passwordConfirm) {
        showError('Ошибка Регистрации', 'Пароли не совпадают! Пожалуйста, проверьте ввод.')
        return
      }

      try {
        loading.value = true
        
        // Проверка существующего пользователя
        const existingUsers = await get(`/users?email=${form.value.email}`)
        if (existingUsers.length > 0) {
          showError('Ошибка Регистрации', 'Пользователь с таким email уже существует.')
          return
        }

        const newUser = {
          name: form.value.name,
          email: form.value.email,
          password: form.value.password,
          progress: { weight: 80, weeklyWorkouts: 0, pushupGoal: 0 },
          trainingPlan: []
        }

        await post('/users', newUser)
        showSuccess(`Поздравляем, ${form.value.name}! Аккаунт создан. Выполните вход.`, { name: 'login' })
        form.value = {
          name: '',
          email: '',
          password: '',
          passwordConfirm: '',
          terms: false
        }
      } catch (error) {
        console.error('Ошибка при регистрации:', error)
        showError('Ошибка сети', 'Не удалось подключиться к API.')
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      loading,
      handleRegistration
    }
  }
}
</script>