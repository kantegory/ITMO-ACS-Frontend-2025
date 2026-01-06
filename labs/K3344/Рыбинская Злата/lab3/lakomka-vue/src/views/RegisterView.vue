<template>
  <section
    class="container d-flex justify-content-center align-items-center"
    style="min-height: 85vh;"
  >
    <div
      class="card p-4 shadow-sm"
      style="max-width: 450px; width: 100%; border-radius: 1rem;"
    >
      <h2 class="text-center mb-4 title">
        Создать аккаунт
      </h2>

      <form>
        <div class="mb-3">
          <label class="form-label">Имя пользователя</label>
          <input
            type="text"
            class="form-control"
            placeholder="Введите имя"
            required
          >
        </div>

        <div class="mb-3">
          <label class="form-label">Электронная почта</label>
          <input
            type="email"
            class="form-control"
            placeholder="Введите email"
            required
          >
        </div>

        <div class="mb-3">
          <label class="form-label">Пароль</label>
          <input
            type="password"
            class="form-control"
            placeholder="Придумайте пароль"
            required
          >
        </div>

        <div class="mb-3">
          <label class="form-label">Подтверждение пароля</label>
          <input
            type="password"
            class="form-control"
            placeholder="Повторите пароль"
            required
          >
        </div>

        <button class="btn register-btn w-100 mt-3">
          Зарегистрироваться
        </button>
      </form>

      <div class="text-center mt-3">
        <RouterLink to="/login" class="login-link">
          Войти
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.title {
  color: #6b3e26;
}

.register-btn {
  background-color: #d47b63;
  color: #fff;
  border: none;
}

.login-link {
  color: #d47b63;
  text-decoration: none;
}
</style>
