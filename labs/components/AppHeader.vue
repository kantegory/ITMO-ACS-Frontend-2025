<template>
  <header class="navbar navbar-expand navbar-dark bg-dark px-3">
    <RouterLink to="/" class="navbar-brand">
      Recipes
    </RouterLink>

    <nav class="navbar-nav ms-auto">
      <RouterLink to="/" class="nav-link">
        Главная
      </RouterLink>

      <RouterLink to="/search" class="nav-link">
        Поиск
      </RouterLink>

      <RouterLink to="/profile" class="nav-link">
        Профиль
      </RouterLink>
    </nav>
  </header>
</template>

<script setup>
</script>
