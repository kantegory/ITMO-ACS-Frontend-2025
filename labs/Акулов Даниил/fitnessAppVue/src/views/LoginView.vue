<template>
    <div class="container">
        <div class="auth-container">
            <h2 class="text-center mb-4">Вход в систему</h2>
            <form @submit.prevent="handleLogin">
                <div class="mb-3">
                    <label for="email" class="form-label">Email адрес</label>
                    <input type="email" class="form-control" id="email" v-model="email" required placeholder="name@example.com">
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Пароль</label>
                    <input type="password" class="form-control" id="password" v-model="password" required>
                </div>
                <div class="mb-3 form-check">
                    <input type="checkbox" class="form-check-input" id="remember">
                    <label class="form-check-label" for="remember">Запомнить меня</label>
                </div>
                <button type="submit" class="btn btn-primary w-100">Войти</button>
                <div class="text-center mt-3">
                    <router-link to="/register">Нет аккаунта? Зарегистрироваться</router-link>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const authStore = useAuthStore()
const router = useRouter()

const handleLogin = async () => {
    const result = await authStore.login(email.value, password.value)
    if (result.success) {
        alert('Успешный вход!')
        router.push('/dashboard')
    } else {
        alert(result.message)
    }
}
</script>
