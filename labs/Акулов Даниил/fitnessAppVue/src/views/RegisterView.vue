<template>
    <div class="container">
        <div class="auth-container">
            <h2 class="text-center mb-4">Регистрация</h2>
            <form @submit.prevent="handleRegister">
                <div class="mb-3">
                    <label for="name" class="form-label">Имя</label>
                    <input type="text" class="form-control" id="name" v-model="name" required>
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label">Email адрес</label>
                    <input type="email" class="form-control" id="email" v-model="email" required>
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Пароль</label>
                    <input type="password" class="form-control" id="password" v-model="password" required>
                </div>
                <button type="submit" class="btn btn-primary w-100">Зарегистрироваться</button>
                <div class="text-center mt-3">
                    <router-link to="/login">Уже есть аккаунт? Войти</router-link>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const name = ref('')
const email = ref('')
const password = ref('')
const authStore = useAuthStore()
const router = useRouter()

const handleRegister = async () => {
    const result = await authStore.register(email.value, password.value, name.value)
    if (result.success) {
        alert('Успешная регистрация!')
        router.push('/dashboard')
    } else {
        alert(result.message)
    }
}
</script>
