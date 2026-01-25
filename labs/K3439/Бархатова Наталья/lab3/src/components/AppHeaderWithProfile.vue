<template>
  <header>
    <nav class="navbar navbar-dark">
      <div class="container d-flex justify-content-between align-items-center">
        <RouterLink class="navbar-brand" to="/restaurants">
          Вечер под контролем — сервис бронирования столов
        </RouterLink>

        <RouterLink to="/profile" class="nav-link text-light" aria-label="Переход в профиль пользователя">
          Профиль
        </RouterLink>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
