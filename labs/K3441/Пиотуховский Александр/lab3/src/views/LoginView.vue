<template>
  <main id="main-content">
    <section class="auth-section">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-5 col-lg-4">
            <div class="auth-card">
              <div class="auth-header text-center mb-4">
                <h1 class="fw-bold mb-2">Вход в аккаунт</h1>
                <p class="text-muted">Рады видеть вас снова!</p>
              </div>

              <form @submit.prevent="handleLogin">
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    v-model="email"
                    placeholder="your@email.com"
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
                    v-model="password"
                    placeholder="••••••••"
                    required
                    autocomplete="current-password"
                  />
                </div>

                <div class="d-flex justify-content-between align-items-center mb-4">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="rememberMe"
                      v-model="rememberMe"
                    />
                    <label class="form-check-label" for="rememberMe">
                      Запомнить меня
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  class="btn btn-primary w-100 mb-4"
                  :disabled="loading"
                >
                  <span v-if="loading">Вход...</span>
                  <span v-else>Войти</span>
                </button>

                <div class="text-center">
                  <p class="mb-0 text-muted">
                    Нет аккаунта?
                    <RouterLink to="/register">Зарегистрируйтесь</RouterLink>
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
import {useAuthStore} from '@/stores/auth'
import {useApi} from '@/composables/useApi'
import {useToast} from '@/composables/useToast'

const router = useRouter()
const authStore = useAuthStore()
const api = useApi()
const {showToast} = useToast()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true

  try {
    const response = await api.login(email.value, password.value)
    const token = response.data.access_token

    authStore.setToken(token)

    const userId = authStore.getUserIdFromToken(token)
    if (userId) {
      const userResponse = await api.getUser(userId)
      authStore.setCurrentUser(userResponse.data)
    }

    showToast('Вход выполнен успешно', 'success')
    router.push('/')
  } catch (error) {
    showToast(
      error.response?.data?.detail || 'Ошибка входа. Проверьте данные',
      'error'
    )
  } finally {
    loading.value = false
  }
}
</script>
