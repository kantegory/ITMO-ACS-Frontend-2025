<template>
  <nav class="navbar navbar-expand-lg navbar-light shadow-sm">
    <div class="container">
      <RouterLink class="navbar-brand" to="/">Рецепты</RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="mainNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/">Главная</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/search">Поиск</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/profile">Кабинет</RouterLink>
          </li>
        </ul>

        <!-- место под user info позже -->
        <div class="d-flex align-items-center">
          <!-- TODO: UserHeader -->
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
</script>
