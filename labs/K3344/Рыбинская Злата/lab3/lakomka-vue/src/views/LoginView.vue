<template>
  <section
    class="container d-flex justify-content-center align-items-center"
    style="min-height: 80vh;"
  >
    <div
      class="card p-4 shadow-sm"
      style="max-width: 400px; width: 100%; border-radius: 1rem;"
    >
      <h2 class="text-center mb-4 title">Вход в аккаунт</h2>

      <form>
        <div class="mb-3">
          <label class="form-label">Электронная почта</label>
          <input
            type="email"
            class="form-control"
            placeholder="Введите email"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Пароль</label>
          <input
            type="password"
            class="form-control"
            placeholder="Введите пароль"
            required
          />
        </div>

        <button type="submit" class="btn login-btn w-100 mt-3">
          Войти
        </button>
      </form>

      <div class="text-center mt-3">
        <RouterLink class="register-link" to="/register">
          Зарегистрироваться
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

.login-btn {
  background-color: #d47b63;
  color: #fff;
  border: none;
}

.register-link {
  color: #d47b63;
  text-decoration: none;
}
</style>
