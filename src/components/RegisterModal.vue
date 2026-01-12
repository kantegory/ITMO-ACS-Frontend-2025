<template>
  <div 
    class="modal fade" 
    ref="modalElement" 
    tabindex="-1" 
    aria-labelledby="registerModalLabel" 
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="registerModalLabel">Регистрация</h5>
          <button type="button" class="btn-close" @click="hide"></button>
        </div>
        <div class="modal-body">
          <input 
            v-model="username" 
            type="text" 
            class="form-control mb-2" 
            placeholder="Логин"
          >
          <input 
            v-model="email" 
            type="email" 
            class="form-control mb-2" 
            placeholder="Email"
          >
          <input 
            v-model="password" 
            type="password" 
            class="form-control mb-2" 
            placeholder="Пароль"
            @keyup.enter="handleRegister"
          >
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" @click="handleRegister">Зарегистрироваться</button>
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
const email = ref('')
const password = ref('')
const modalElement = ref<HTMLElement>()
let modal: Modal | null = null

const { register } = useAuth()
const { showToast } = useToast()

const emit = defineEmits(['register-success'])

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
  email.value = ''
  password.value = ''
}

const handleRegister = async () => {
  if (!username.value || !email.value || !password.value) {
    showToast('Заполните все поля!', 'danger')
    return
  }

  try {
    const response = await register(username.value, email.value, password.value)
    if (response.success) {
      hide()
      showToast(`Регистрация успешна! Добро пожаловать, ${username.value}`, 'success')
      emit('register-success')
    } else {
      showToast(response.message || 'Ошибка регистрации', 'danger')
    }
  } catch (error) {
    showToast('Ошибка регистрации', 'danger')
  }
}

defineExpose({ show, hide })
</script>

