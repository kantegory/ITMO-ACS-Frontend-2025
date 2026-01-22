<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow auth-card">
          <div class="card-body p-4">
            <div class="auth-header">
              <h3 class="card-title text-center mb-2">Регистрация</h3>
              <p class="text-muted text-center">Создайте новый аккаунт</p>
            </div>

            <form @submit.prevent="onSubmit" :class="{ 'was-validated': validated }" novalidate>
              <div class="mb-3">
                <label class="form-label">Имя пользователя</label>
                <input
                    v-model="username"
                    type="text"
                    class="form-control"
                    required
                    minlength="3"
                    autocomplete="username"
                />
                <div class="invalid-feedback">Минимум 3 символа</div>
              </div>

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
                    autocomplete="new-password"
                />
                <div class="invalid-feedback">Пароль должен быть минимум 6 символов</div>
              </div>

              <button class="btn btn-primary w-100 mb-3" :disabled="loading">
                {{ loading ? 'Создание...' : 'Зарегистрироваться' }}
              </button>

              <div class="text-center">
                <span>Уже есть аккаунт?</span>
                <RouterLink to="/login" class="text-decoration-none">Войти</RouterLink>
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
import { register } from '@/api/auth.api';
import { useRouter } from 'vue-router';

const username = ref('');
const email = ref('');
const password = ref('');
const loading = ref(false);
const validated = ref(false);

const message = ref('');
const messageType = ref('');

const router = useRouter();

async function onSubmit() {
  validated.value = true;

  if (!username.value || username.value.length < 3) return;
  if (!email.value) return;
  if (!password.value || password.value.length < 6) return;

  loading.value = true;
  message.value = '';

  try {
    await register(email.value, password.value, username.value);

    message.value = 'Аккаунт успешно создан';
    messageType.value = 'alert-success';

    setTimeout(() => {
      router.push('/profile');
    }, 500);
  } catch (err) {
    message.value = err.message || 'Ошибка регистрации';
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