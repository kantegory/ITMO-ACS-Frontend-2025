<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const router = useRouter();

const form = ref({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  password2: "",
  terms: false,
});

const error = ref(null);
const loading = ref(false);

async function submit() {
  error.value = null;

  if (form.value.password !== form.value.password2) {
    error.value = "Пароли не совпадают";
    return;
  }

  if (!form.value.terms) {
    error.value = "Необходимо принять условия";
    return;
  }

  loading.value = true;
  try {
    await auth.register({
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      phone: form.value.phone,
      password: form.value.password,
    });
    router.push("/login");
  } catch (e) {
    error.value = "Ошибка регистрации";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <main class="py-4 flex-fill">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-7 col-lg-6">
          <h1 class="h3 mb-3 text-center">Регистрация</h1>

          <form @submit.prevent="submit">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Имя</label>
                <input v-model="form.firstName" class="form-control" required />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Фамилия</label>
                <input v-model="form.lastName" class="form-control" required />
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Почта</label>
              <input v-model="form.email" type="email" class="form-control" required />
            </div>

            <div class="mb-3">
              <label class="form-label">Телефон</label>
              <input v-model="form.phone" type="tel" class="form-control" placeholder="+7..." />
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Пароль</label>
                <input v-model="form.password" type="password" class="form-control" required />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Повторите пароль</label>
                <input v-model="form.password2" type="password" class="form-control" required />
              </div>
            </div>

            <div class="form-check mb-3">
              <input v-model="form.terms" class="form-check-input" type="checkbox" />
              <label class="form-check-label">
                Я принимаю условия использования сервиса
              </label>
            </div>

            <div v-if="error" class="alert alert-danger">{{ error }}</div>

            <button class="btn btn-success w-100" :disabled="loading">
              Создать аккаунт
            </button>
          </form>

          <p class="mt-3 text-center">
            Уже зарегистрированы?
            <RouterLink to="/login">Войти</RouterLink>
          </p>
        </div>
      </div>
    </div>
  </main>
</template>
