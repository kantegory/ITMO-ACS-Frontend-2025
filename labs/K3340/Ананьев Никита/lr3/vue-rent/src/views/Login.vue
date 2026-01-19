<template>
    <div class="auth-main">
        <div class="form-container">
            <h2>Вход</h2>
            <p v-if="error" class="error">{{ error }}</p>

            <input v-model="loginData.email" type="email" id="email" placeholder="Email" />
            <input v-model="loginData.password" type="password" id="password" placeholder="Пароль" />
            
            <button @click="login">Войти</button>
            <div class="link">Нет аккаунта? 
                <router-link to="/register"> Регистрация </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import useUserStore from '@/stores/userStorage';
import { processAuthError } from '@/utils/auth';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

const userStorage = useUserStore()

const { user } = storeToRefs(userStorage)

const { loadUser } = userStorage

const loginData = reactive(clearedForm())

const error = ref('')

const router = useRouter()

function clearedForm() {
    return {
        email: null,
        password: null
    }
}

onMounted(() => {
    document.title = "Войти"
})

async function login() {
    error.value = ""

    if (!loginData.email || !loginData.password) {
        processAuthError(loginData, clearedForm, error, "Пожалуйста, заполните все поля")
        return;
    }

    try {
        await loadUser(loginData.email)
    } catch (e) {
        console.log(`Failed to load user with email=${loginData.email}; error=${e}`)
        processAuthError(loginData, clearedForm, error, "Ошибка загрузки учетных данных")
        return;
    }

    if (user.value.password !== loginData.password) {
        processAuthError(loginData, clearedForm, error, "Неверные данные для входа")
        return;
    }

    router.push("/main")
}
</script>

<style src="../assets/auth.css" scoped></style>