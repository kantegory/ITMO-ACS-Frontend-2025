<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-sm">
          <div class="card-body">
            <h3 class="card-title mb-4">Регистрация</h3>
            <form @submit.prevent="handleRegister">
              <div class="mb-3">
                <label for="fullname" class="form-label">Полное имя</label>
                <input v-model="fullname" type="text" class="form-control" required />
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input v-model="email" type="email" class="form-control" required />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Пароль</label>
                <input v-model="password" type="password" class="form-control" required />
              </div>
              <div class="mb-3">
                <label for="confirmPassword" class="form-label">Подтвердите пароль</label>
                <input v-model="confirmPassword" type="password" class="form-control" required />
              </div>
              <div class="mb-3 form-check">
                <input v-model="agree" type="checkbox" class="form-check-input" required />
                <label class="form-check-label">Согласен с <a href="#">правилами сервиса</a></label>
              </div>
              <div class="mb-3 form-check">
                <input v-model="remember" type="checkbox" class="form-check-input" />
                <label class="form-check-label">Запомнить меня</label>
              </div>

              <button :disabled="loading" type="submit" class="btn btn-primary w-100">
                {{ loading ? "Регистрация..." : "Зарегистрироваться" }}
              </button>
            </form>

            <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>

            <hr />
            <div class="text-center">
              Уже есть аккаунт? <router-link to="/login">Войти</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth.js";

const router = useRouter();
const { register, loading, error } = useAuth();

const fullname = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const agree = ref(false);
const remember = ref(false);

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    alert("Пароли не совпадают");
    return;
  }
  const success = await register({ fullname: fullname.value, email: email.value, password: password.value, remember: remember.value });
  if (success) router.push("/");
};
</script>
