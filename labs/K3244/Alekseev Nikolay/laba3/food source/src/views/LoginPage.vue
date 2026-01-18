<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center bg-light">
    <div class="card shadow p-4" style="width: 400px;">
      <h3 class="mb-3 text-center">Вход</h3>

      <input v-model="name" type="text" class="form-control mb-3" placeholder="Имя пользователя" />

      <button class="btn btn-primary w-100" @click="onLogin">Войти</button>

      <p class="mt-3 text-center">
        Нет аккаунта?
        <router-link to="/register">Регистрация</router-link>
      </p>

      <p v-if="error" class="text-danger small mt-2 mb-0">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/auth"

const router = useRouter()
const auth = useAuthStore()

const name = ref("")
const error = ref("")

async function onLogin() {
  error.value = ""
  const n = name.value.trim()
  if (!n) return

  try {
    await auth.loginByName(n)
    router.push("/")
  } catch {
    error.value = "Пользователь не найден. Зарегистрируйтесь."
  }
}
</script>
