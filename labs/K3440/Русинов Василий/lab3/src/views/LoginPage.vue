<script setup>
import { ref } from "vue";
import { useAuth } from "@/composables/useAuth";

const email = ref("");
const password = ref("");
const { login } = useAuth();
</script>

<template>
  <div class="container vh-100 d-flex justify-content-center align-items-center">
    <div class="card p-4" style="max-width: 400px">
      <h1>Вход</h1>

      <input v-model="email" class="form-control mb-2" placeholder="Email" />
      <input
        v-model="password"
        type="password"
        class="form-control mb-3"
        placeholder="Пароль"
      />

      <button class="btn btn-primary w-100" @click="login(email, password)">
        Войти
      </button>
    </div>
  </div>
</template>
