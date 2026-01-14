<template>
  <div class="container" style="max-width: 520px">
    <h1 class="mb-4">Вход</h1>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <form @submit.prevent="onSubmit">
      <div class="mb-3">
        <label class="form-label" for="email">Email</label>
        <input id="email" v-model.trim="email" class="form-control" type="email" required />
      </div>

      <div class="mb-3">
        <label class="form-label" for="password">Пароль</label>
        <input id="password" v-model="password" class="form-control" type="password" required />
      </div>

      <button class="btn btn-primary w-100" type="submit" :disabled="loading">
        Войти
      </button>
    </form>

    <div class="mt-3 text-center">
      <RouterLink to="/register">Нет аккаунта? Регистрация</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute, RouterLink } from "vue-router";
import { useAuth } from "../composables/useAuth";

const router = useRouter();
const route = useRoute();
const { login, loading, error } = useAuth();

const email = ref("");
const password = ref("");

async function onSubmit() {
  const ok = await login({ email: email.value, password: password.value });
  if (!ok) return;

  const redirect = typeof route.query.redirect === "string" ? route.query.redirect : "/catalog";
  router.push(redirect);
}
</script>
