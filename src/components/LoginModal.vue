<template>
  <div 
    class="modal fade" 
    ref="modalElement" 
    tabindex="-1" 
    aria-labelledby="loginModalLabel" 
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="loginModalLabel">Вход</h5>
          <button type="button" class="btn-close" @click="hide"></button>
        </div>
        <div class="modal-body">
          <input 
            v-model="username" 
            type="text" 
            class="form-control mb-2" 
            placeholder="Логин"
            @keyup.enter="handleLogin"
          >
          <input 
            v-model="password" 
            type="password" 
            class="form-control mb-2" 
            placeholder="Пароль"
            @keyup.enter="handleLogin"
          >
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" @click="handleLogin">Войти</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'

const username = ref('')
const password = ref('')
const modalElement = ref<HTMLElement>()
let modal: Modal | null = null

const { login } = useAuth()
const { showToast } = useToast()

const emit = defineEmits(['login-success'])

onMounted(() => {
  if (modalElement.value) {
    modal = new Modal(modalElement.value)
  }
})

const show = () => {
  modal?.show()
}

const hide = () => {
  modal?.hide()
  username.value = ''
  password.value = ''
}

const handleLogin = async () => {
  if (!username.value || !password.value) {
    showToast('Заполните все поля!', 'danger')
    return
  }

  try {
    const response = await login(username.value, password.value)
    if (response.success) {
      hide()
      showToast(`Добро пожаловать, ${username.value}`, 'success')
      emit('login-success')
    } else {
      showToast(response.message || 'Неверный логин или пароль', 'danger')
    }
  } catch (error) {
    showToast('Ошибка входа', 'danger')
  }
}

defineExpose({ show, hide })
</script>

