<script setup>
import FormContainer from "@/components/FormContainer.vue";
import FormField from "@/components/FormField.vue";
import Navbar from "@/components/Navbar.vue";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

const form = ref({ username: "", password: "" });

const userStore = useUserStore();

const handleLogin = async () => {
  try {
    await userStore.login(form.value.username, form.value.password);
  } catch (error) {
    console.error("Login failed:", error);
  }
};
</script>

<template>
  <Navbar />
  <FormContainer>
    <div class="text-center mb-4">
      <h2 class="card-title text-danger mb-2">Вход в аккаунт</h2>
      <p class="text-muted">
        Войдите, чтобы сохранять рецепты и делиться своими кулинарными шедеврами
      </p>
    </div>

    <form @submit.prevent="handleLogin">
      <FormField
        v-model=form.username
        type="text"
        id="username"
        label="Имя пользователя"
        placeholder="Ваше имя пользователя"
        isRequired="true"
        addBottomMargin="true"
      />
      <FormField
        v-model=form.password
        type="password"
        id="password"
        label="Пароль"
        placeholder="Ваш пароль"
        isRequired="true"
        addBottomMargin="true"
      />
      <button type="submit" class="btn btn-danger w-100 py-2 mb-3">Войти</button>
    </form>
    <div class="text-center">
      <p class="mb-2">
        Нет аккаунта?
        <router-link :to="{ name: 'register' }"> Зарегистрируйтесь </router-link>
      </p>
    </div>
  </FormContainer>
</template>
