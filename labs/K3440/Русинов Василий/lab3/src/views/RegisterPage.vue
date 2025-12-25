<script setup>
import { ref } from "vue";
import { useAuth } from "@/composables/useAuth";

const name = ref("");
const email = ref("");
const password = ref("");
const password2 = ref("");

const { register } = useAuth();

function submit() {
  if (password.value !== password2.value) {
    alert("Пароли не совпадают");
    return;
  }

  register({
    name: name.value,
    email: email.value,
    password: password.value
  });
}
</script>

<template>
  <div class="container vh-100 d-flex justify-content-center align-items-center">
    <div class="card p-4" style="max-width: 420px">
      <h1>Регистрация</h1>

      <input v-model="name" class="form-control mb-2" placeholder="Имя" />
      <input v-model="email" class="form-control mb-2" placeholder="Email" />
      <input
        v-model="password"
        type="password"
        class="form-control mb-2"
        placeholder="Пароль"
      />
      <input
        v-model="password2"
        type="password"
        class="form-control mb-3"
        placeholder="Повтор пароля"
      />

      <button class="btn btn-success w-100" @click="submit">
        Создать аккаунт
      </button>
    </div>
  </div>
</template>
