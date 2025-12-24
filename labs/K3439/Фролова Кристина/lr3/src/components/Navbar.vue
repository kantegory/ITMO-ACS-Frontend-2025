<script setup>
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useTheme } from "@/composables/useTheme";

const auth = useAuthStore();
const isAuth = computed(() => auth.isAuthenticated);

const { theme, iconHref, toggleTheme } = useTheme();
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark" aria-label="Основная навигация">
    <a class="visually-hidden-focusable" href="#main">Перейти к содержимому</a>

    <div class="container">
      <RouterLink class="navbar-brand icon-text" to="/">
        <svg class="icon-house" width="24" height="24" aria-hidden="true">
          <use href="#icon-house"></use>
        </svg>
        <span>Площадь.ру</span>
      </RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbar"
        aria-controls="navbar"
        aria-expanded="false"
        aria-label="Открыть меню навигации"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbar">
        <ul class="navbar-nav ms-auto align-items-lg-center gap-2">

          <template v-if="!isAuth">
            <li class="nav-item">
              <RouterLink class="btn btn-outline-light me-2" to="/login">
                Вход
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="btn btn-light" to="/register">
                Регистрация
              </RouterLink>
            </li>
          </template>

          <template v-else>
            <li class="nav-item">
              <RouterLink class="nav-link text-white" to="/profile">
                Личный кабинет
              </RouterLink>
            </li>
            <li class="nav-item">
              <button
                class="nav-link p-2 theme-toggle"
                type="button"
                @click="toggleTheme"
                :aria-label="`Переключить тему (сейчас ${theme})`"
                title="Переключить тему"
              >
                <svg width="24" height="24" aria-hidden="true">
                  <use :href="iconHref"></use>
                </svg>
              </button>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>


<style scoped>
.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  line-height: 1;
}

.brand__icon {
  display: block;
  flex-shrink: 0;
  vertical-align: middle;
}

.brand__text {
  line-height: 1;
}
</style>
