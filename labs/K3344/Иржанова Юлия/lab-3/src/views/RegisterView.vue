<template>
  <div class="container" style="max-width: 520px">
    <h1 class="mb-4">Регистрация</h1>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <form @submit.prevent="onSubmit">
      <div class="mb-3">
        <label class="form-label" for="name">Имя</label>
        <input id="name" v-model.trim="name" class="form-control" required minlength="2" />
      </div>

      <div class="mb-3">
        <label class="form-label" for="email">Email</label>
        <input id="email" v-model.trim="email" class="form-control" type="email" required />
      </div>

      <div class="mb-3">
        <label class="form-label" for="password">Пароль</label>
        <input id="password" v-model="password" class="form-control" type="password" required minlength="6" />
      </div>

      <button class="btn btn-success w-100" type="submit" :disabled="loading">
        Создать аккаунт
      </button>
    </form>

    <div class="mt-3 text-center">
      <RouterLink to="/login">Уже есть аккаунт? Вход</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { useAuth } from "../composables/useAuth";

const router = useRouter();
const { register, loading, error } = useAuth();

const name = ref("");
const email = ref("");
const password = ref("");

async function onSubmit() {
  const ok = await register({ name: name.value, email: email.value, password: password.value });
  if (!ok) return;
  router.push("/catalog");
}
</script>
