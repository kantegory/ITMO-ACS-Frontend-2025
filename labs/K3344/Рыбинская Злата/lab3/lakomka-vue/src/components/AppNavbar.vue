<template>
  <nav class="navbar navbar-expand-lg navbar-light">
    <div class="container">
      <a class="navbar-brand" href="#">Лакомка</a>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/">Главная</RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink class="nav-link" to="/login">Вход</RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink class="nav-link" to="/register">Регистрация</RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink class="nav-link" to="/profile">Личный кабинет
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
