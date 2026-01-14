<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <RouterLink class="navbar-brand" to="/catalog">AlbumRate</RouterLink>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Переключить навигацию"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <RouterLink class="nav-link" active-class="active" to="/catalog">
                Каталог
              </RouterLink>
            </li>

            <li class="nav-item">
              <RouterLink class="nav-link" active-class="active" to="/profile">
                Профиль
              </RouterLink>
            </li>

            <li class="nav-item">
            <button class="nav-link btn btn-link p-0" type="button" @click="toggleTheme">
                {{ buttonText() }}
            </button>
            </li>

            <li v-if="isAuthenticated" class="nav-item">
            <button class="nav-link btn btn-link p-0" type="button" @click="onLogout">Выход</button>
            </li>
            <li v-else class="nav-item">
            <RouterLink class="nav-link" active-class="active" to="/login">Вход</RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { RouterLink, useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth";
import { useTheme } from "../composables/useTheme";

const router = useRouter();
const { isAuthenticated, logout } = useAuth();
const { toggleTheme, buttonText } = useTheme();

function onLogout() {
  if (!isAuthenticated.value) return;
  logout();
  router.push("/login");
}
</script>

