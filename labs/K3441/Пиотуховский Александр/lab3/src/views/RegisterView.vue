<template>
  <main id="main-content">
    <section class="auth-section">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-6 col-lg-5">
            <div class="auth-card">
              <div class="auth-header text-center mb-4">
                <h1 class="fw-bold mb-2">Создать аккаунт</h1>
                <p class="text-muted">Присоединяйтесь к нашему сообществу!</p>
              </div>

              <form @submit.prevent="handleRegister">
                <div class="mb-3">
                  <label for="username" class="form-label">Имя пользователя</label>
                  <input
                    type="text"
                    class="form-control"
                    id="username"
                    v-model="formData.username"
                    placeholder="Иван Иванов"
                    required
                    minlength="3"
                    autocomplete="name"
                  />
                  <small class="text-muted">Минимум 3 символа</small>
                </div>

                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    v-model="formData.email"
                    placeholder="email@example.com"
                    required
                    autocomplete="email"
                  />
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Пароль</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    v-model="formData.password"
                    placeholder="••••••••"
                    required
                    minlength="8"
                    autocomplete="new-password"
                  />
                  <small class="text-muted">Минимум 8 символов</small>
                </div>

                <button
                  type="submit"
                  class="btn btn-primary w-100 mb-4"
                  :disabled="loading"
                >
                  <span v-if="loading">Регистрация...</span>
                  <span v-else>Создать аккаунт</span>
                </button>

                <div class="text-center">
                  <p class="mb-0 text-muted">
                    Уже есть аккаунт?
                    <RouterLink to="/login">Войдите</RouterLink>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import {ref} from 'vue'
import {RouterLink, useRouter} from 'vue-router'
import {useApi} from '@/composables/useApi'
import {useToast} from '@/composables/useToast'

const router = useRouter()
const api = useApi()
const {showToast} = useToast()

const formData = ref({
  username: '',
  email: '',
  password: ''
})

const loading = ref(false)

const handleRegister = async () => {
  loading.value = true

  try {
    await api.register(formData.value)
    showToast('Регистрация успешна! Теперь вы можете войти', 'success')
    router.push('/login')
  } catch (error) {
    showToast(
      error.response?.data?.detail || 'Ошибка регистрации',
      'error'
    )
  } finally {
    loading.value = false
  }
}
</script>
