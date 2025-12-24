<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref(null);

async function submit() {
  loading.value = true;
  error.value = null;
  try {
    await auth.login({ email: email.value, password: password.value });
    router.push(route.query.redirect || "/");
  } catch (e) {
    error.value = "Неверная почта или пароль";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <main class="py-5 flex-fill">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-5">
          <h1 class="h3 mb-3 text-center">Вход</h1>
          <form @submit.prevent="submit">
            <div class="mb-3">
              <label class="form-label">Почта</label>
              <input :disabled="loading" v-model="email" type="email" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Пароль</label>
              <input :disabled="loading" v-model="password" type="password" class="form-control" required />
            </div>
            <div v-if="error" class="alert alert-danger">{{ error }}</div>
            <button type="submit" class="btn btn-primary w-100" :disabled="loading">
              Войти
            </button>
          </form>
          <p class="mt-3 text-center">
            Нет аккаунта?
            <RouterLink to="/register">Зарегистрироваться</RouterLink>
          </p>
        </div>
      </div>
    </div>
  </main>
</template>
