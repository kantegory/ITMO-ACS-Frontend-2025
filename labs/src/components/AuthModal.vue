<template>
  <div class="modal fade" id="authModal" tabindex="-1" aria-labelledby="authModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="authModalLabel">Вход / Регистрация</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleAuth">
            <div class="mb-3">
              <label for="username" class="form-label">Имя</label>
              <input
                v-model="username"
                type="text"
                class="form-control"
                id="username"
                required
                minlength="2"
              >
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Пароль</label>
              <input
                v-model="password"
                type="password"
                class="form-control"
                id="password"
                required
              >
            </div>
            <button type="submit" class="btn btn-primary w-100" :disabled="authLoading">
              {{ authLoading ? 'Обработка...' : 'Войти / Зарегистрироваться' }}
            </button>
          </form>
          <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useApi } from '@/composables/useApi.js'
import { useUser } from '@/composables/useUser.js'

const { getUsers, registerUser } = useApi()
const { updateUser } = useUser()

const username = ref('')
const password = ref('')
const authLoading = ref(false)
const error = ref('')

const handleAuth = async () => {
  error.value = ''
  authLoading.value = true

  try {
    const users = await getUsers(username.value.trim(), password.value.trim())
    if (users.length > 0) {
      // Вход
      updateUser(username.value.trim())
      closeModal()
      alert('Добро пожаловать!')
    } else {
      // Регистрация
      await registerUser({ username: username.value.trim(), password: password.value.trim() })
      updateUser(username.value.trim())
      closeModal()
      alert('Вы зарегистрированы и вошли!')
    }
  } catch (e) {
    error.value = 'Ошибка сервера или регистрации'
  } finally {
    authLoading.value = false
  }
}

const closeModal = () => {
  username.value = ''
  password.value = ''
  const modalEl = document.getElementById('authModal')
  const modal = bootstrap.Modal.getInstance(modalEl)
  if (modal) modal.hide()
}
</script>