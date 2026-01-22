<template>
  <main class="container" style="margin-top: 50px; margin-bottom: 50px;" role="main" tabindex="-1" aria-labelledby="registerHeading">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <h2 id="registerHeading" class="text-center mb-4">Регистрация</h2>
        <form @submit.prevent="handleRegister">
          <div class="mb-3">
            <label for="regName" class="form-label">Имя</label>
            <input type="text" class="form-control" id="regName" v-model="name" required>
          </div>
          <div class="mb-3">
            <label for="regEmail" class="form-label">Email</label>
            <input type="email" class="form-control" id="regEmail" v-model="email" required autocomplete="email">
          </div>
          <div class="mb-3">
            <label for="regPassword" class="form-label">Пароль</label>
            <input type="password" class="form-control" id="regPassword" v-model="password" required autocomplete="new-password">
          </div>
          <div class="mb-3">
            <label for="regPasswordConfirm" class="form-label">Подтвердите пароль</label>
            <input type="password" class="form-control" id="regPasswordConfirm" v-model="confirmPassword" required autocomplete="new-password">
          </div>
          <div class="mb-3">
            <button type="submit" class="btn btn-primary w-100" :disabled="loading">
              {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
            </button>
          </div>
          <div class="text-center mt-3">
            <p>Уже есть аккаунт? <router-link to="/login">Войти</router-link></p>
          </div>
          <FormFeedback :message="message" :type="messageType" />
        </form>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useApi } from '../composables/useApi';
import FormFeedback from '../components/FormFeedback.vue';

const router = useRouter();
const { registerUser } = useApi();

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const message = ref('');
const messageType = ref('error');

async function handleRegister() {
  if (password.value !== confirmPassword.value) {
    message.value = 'Пароли не совпадают';
    messageType.value = 'error';
    return;
  }

  loading.value = true;
  message.value = '';

  try {
    await registerUser({
      name: name.value.trim(),
      email: email.value.trim(),
      password: password.value.trim()
    });
    message.value = 'Регистрация прошла успешно! Перенаправляем...';
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
</script>
