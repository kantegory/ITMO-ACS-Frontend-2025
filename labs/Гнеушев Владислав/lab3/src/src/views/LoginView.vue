<template>
  <main class="container" style="margin-top: 50px; margin-bottom: 50px;" role="main" tabindex="-1" aria-labelledby="loginHeading">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <h2 id="loginHeading" class="text-center mb-4">Вход в систему</h2>
        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" class="form-control" id="email" v-model="email" required autocomplete="email">
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Пароль</label>
            <input type="password" class="form-control" id="password" v-model="password" required autocomplete="current-password">
          </div>
          <div class="mb-3">
            <button type="submit" class="btn btn-primary w-100" :disabled="loading">
              {{ loading ? 'Входим...' : 'Войти' }}
            </button>
          </div>
          <div class="text-center">
            <a href="#" @click.prevent="showForgotModal = true">Забыли пароль?</a>
          </div>
          <div class="text-center mt-3">
            <p>Нет аккаунта? <router-link to="/register">Зарегистрироваться</router-link></p>
          </div>
          <FormFeedback :message="message" :type="messageType" />
        </form>
      </div>
    </div>
  </main>

  <!-- Forgot Password Modal -->
  <div class="modal fade" :class="{ show: showForgotModal }" :style="{ display: showForgotModal ? 'block' : 'none' }" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="forgotPasswordModalLabel">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="forgotPasswordModalLabel">Восстановление пароля</h5>
          <button type="button" class="btn-close" @click="showForgotModal = false"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleForgotPassword">
            <div class="mb-3">
              <label for="resetEmail" class="form-label">Введите ваш Email</label>
              <input type="email" class="form-control" id="resetEmail" v-model="resetEmail" required autocomplete="email">
            </div>
            <button type="submit" class="btn btn-primary">Отправить</button>
            <FormFeedback :message="forgotMessage" :type="forgotMessageType" />
          </form>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showForgotModal" class="modal-backdrop fade show" @click="showForgotModal = false"></div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useApi } from '../composables/useApi';
import FormFeedback from '../components/FormFeedback.vue';

const router = useRouter();
const { loginUser } = useApi();

const email = ref('');
const password = ref('');
const loading = ref(false);
const message = ref('');
const messageType = ref('error');

const showForgotModal = ref(false);
const resetEmail = ref('');
const forgotMessage = ref('');
const forgotMessageType = ref('error');

async function handleLogin() {
  loading.value = true;
  message.value = '';

  try {
    await loginUser(email.value.trim(), password.value.trim());
    message.value = 'Успешный вход! Перенаправляем...';
    messageType.value = 'success';
    setTimeout(() => router.push('/profile'), 800);
  } catch (error) {
    console.error(error);
    message.value = error.message;
    messageType.value = 'error';
  } finally {
    loading.value = false;
  }
}

function handleForgotPassword() {
  if (!resetEmail.value.trim()) {
    forgotMessage.value = 'Введите email';
    forgotMessageType.value = 'error';
    return;
  }

  forgotMessage.value = 'Если email зарегистрирован, мы отправим инструкцию.';
  forgotMessageType.value = 'success';
  setTimeout(() => {
    showForgotModal.value = false;
    forgotMessage.value = '';
    resetEmail.value = '';
  }, 1500);
}
</script>

<style scoped>
.modal.show {
  display: block;
}
</style>
