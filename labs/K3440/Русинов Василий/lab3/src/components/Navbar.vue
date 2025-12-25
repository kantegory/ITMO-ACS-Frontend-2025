<script setup>
import { useRoute } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { useTheme } from "@/composables/useTheme";

const route = useRoute();
const { logout, isAuth } = useAuth();
const { toggleTheme } = useTheme();
</script>

<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container">
      <RouterLink class="navbar-brand" to="/search">
        RentHouse
      </RouterLink>

      <div class="d-flex gap-2 align-items-center">

        <RouterLink
          v-if="isAuth && route.path !== '/search'"
          to="/search"
          class="btn btn-outline-primary"
        >
          Поиск
        </RouterLink>

        <RouterLink
          v-if="isAuth && route.path !== '/profile'"
          to="/profile"
          class="btn btn-outline-primary"
        >
          Профиль
        </RouterLink>

        <button
          class="btn btn-outline-secondary"
          @click="toggleTheme"
          aria-label="Сменить тему"
        >
          🌙
        </button>

        <button
          v-if="isAuth"
          class="btn btn-danger"
          @click="logout"
        >
          Выйти
        </button>

        <template v-if="!isAuth">
          <RouterLink to="/login" class="btn btn-outline-primary">
            Войти
          </RouterLink>
          <RouterLink to="/register" class="btn btn-outline-success">
            Регистрация
          </RouterLink>
        </template>

      </div>
    </div>
  </nav>
</template>
