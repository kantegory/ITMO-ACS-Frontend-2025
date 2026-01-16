<script setup>
import { ref } from "vue";
import { useApi } from "@/composables/useApi";
import { useAuth } from "@/composables/useAuth";
import LoginModal from "./LoginModal.vue";
import RegisterModal from "./RegisterModal.vue";

const api = useApi();
const { isAuthenticated, login: setAuth, logout: doLogout } = useAuth();

const showLogin = ref(false);
const showRegister = ref(false);

const loginEmail = ref("");
const loginPassword = ref("");
const loginError = ref("");

const regName = ref("");
const regEmail = ref("");
const regPassword = ref("");
const regConfirm = ref("");
const registerError = ref("");

async function login() {
  loginError.value = "";
  try {
    const data = await api.post("/login", {
      email: loginEmail.value,
      password: loginPassword.value,
    });
    setAuth(data);
    showLogin.value = false;
    loginEmail.value = "";
    loginPassword.value = "";
  } catch (err) {
    loginError.value = err.response?.data || err.message;
  }
}

async function register() {
  registerError.value = "";
  if (regPassword.value !== regConfirm.value) {
    registerError.value = "Пароли не совпадают";
    return;
  }
  if (regPassword.value.length < 8) {
    registerError.value = "Пароль минимум 8 символов";
    return;
  }
  try {
    await api.post("/register", {
      name: regName.value,
      email: regEmail.value,
      password: regPassword.value,
    });
    showRegister.value = false;
    regName.value = "";
    regEmail.value = "";
    regPassword.value = "";
    regConfirm.value = "";
  } catch (err) {
    registerError.value = err.response?.data || err.message;
  }
}

function logout() {
  doLogout();
}
</script>

<template>
  <nav
    class="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm"
  >
    <div class="container">
      <router-link class="navbar-brand" to="/">FitPlatform</router-link>
      <button
        class="navbar-toggler"
        data-bs-toggle="collapse"
        data-bs-target="#navMain"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navMain">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/workouts"
              >Тренировки</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/blog">Блог</router-link>
          </li>
          <li v-if="isAuthenticated" class="nav-item">
            <router-link class="nav-link" to="/profile"
              >Личный кабинет</router-link
            >
          </li>
        </ul>

        <div class="d-flex">
          <button
            v-if="!isAuthenticated"
            class="btn btn-outline-primary me-2"
            @click="showLogin = true"
          >
            Вход
          </button>
          <button
            v-if="!isAuthenticated"
            class="btn btn-primary"
            @click="showRegister = true"
          >
            Регистрация
          </button>
          <button v-if="isAuthenticated" class="btn btn-danger" @click="logout">
            Выход
          </button>
        </div>
      </div>
    </div>

    <LoginModal
      v-model="showLogin"
      :email="loginEmail"
      :password="loginPassword"
      :error="loginError"
      @update:email="loginEmail = $event"
      @update:password="loginPassword = $event"
      @submit="login"
    >
      <template #switch>
        <button
          type="button"
          class="btn btn-link"
          @click="
            showRegister = true;
            showLogin = false;
          "
        >
          Регистрация
        </button>
      </template>
    </LoginModal>

    <RegisterModal
      v-model="showRegister"
      :name="regName"
      :email="regEmail"
      :password="regPassword"
      :confirm="regConfirm"
      :error="registerError"
      @update:name="regName = $event"
      @update:email="regEmail = $event"
      @update:password="regPassword = $event"
      @update:confirm="regConfirm = $event"
      @submit="register"
    >
      <template #switch>
        <button
          type="button"
          class="btn btn-link"
          @click="
            showLogin = true;
            showRegister = false;
          "
        >
          Вход
        </button>
      </template>
    </RegisterModal>
  </nav>
</template>
