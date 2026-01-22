<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow auth-card">
          <div class="card-body p-4">
            <div class="auth-header">
              <h3 class="card-title text-center mb-2">Вход в аккаунт</h3>
              <p class="text-muted text-center">Введите ваши учетные данные</p>
            </div>

            <form @submit.prevent="onSubmit" novalidate :class="{ 'was-validated': validated }">
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input
                    v-model="email"
                    type="email"
                    class="form-control"
                    required
                    autocomplete="email"
                />
                <div class="invalid-feedback">Введите корректный email</div>
              </div>

              <div class="mb-3">
                <label class="form-label">Пароль</label>
                <input
                    v-model="password"
                    type="password"
                    class="form-control"
                    required
                    minlength="6"
                    autocomplete="current-password"
                />
                <div class="invalid-feedback">Пароль должен содержать минимум 6 символов</div>
              </div>

              <button class="btn btn-primary w-100 mb-3" :disabled="loading">
                {{ loading ? 'Вход...' : 'Войти' }}
              </button>

              <div class="text-center">
                <span>Нет аккаунта? </span>
                <RouterLink to="/register" class="text-decoration-none">
                  Зарегистрироваться
                </RouterLink>
              </div>
            </form>

            <div v-if="message" :class="['alert', messageType, 'mt-3']">
              {{ message }}
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { login } from '@/api/auth.api';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const loading = ref(false);
const validated = ref(false);

const message = ref('');
const messageType = ref('');

const router = useRouter();

async function onSubmit() {
  validated.value = true;

  if (!email.value || !password.value || password.value.length < 6) {
    return;
  }

  loading.value = true;
  message.value = '';

  try {
    await login(email.value, password.value);
    message.value = 'Вход выполнен успешно';
    messageType.value = 'alert-success';

    setTimeout(() => {
      router.push('/profile');
    }, 500);
  } catch (err) {
    message.value = err.message || 'Ошибка входа';
    messageType.value = 'alert-danger';
  }

  loading.value = false;
}
</script>

<style scoped>
.auth-card {
  border-radius: 12px;
}
</style>