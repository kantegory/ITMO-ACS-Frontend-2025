<template>
    <div class="auth-main">
        <div class="form-container">
            <h2>Регистрация</h2>
            <p v-if="error" class="error">{{ error }}</p>

            <input v-model="regData.name" type="text" id="name" placeholder="Ваше имя" />
            <input v-model="regData.email" type="email" id="email" placeholder="Email" />
            <input v-model="regData.phone" type="tel" id="phone" placeholder="Телефон" />
            <input v-model="regData.password" type="password" id="password" placeholder="Пароль" />

            <button @click="register">Создать аккаунт</button>
            <div class="link">Уже есть аккаунт? 
                <router-link to="/login"> Войти </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import useUserStore from '@/stores/userStorage';
import { userApi } from '@/router';
import { processAuthError } from '@/utils/auth';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const userStore = useUserStore()

const {DEFAULT_ROLE, createUser} = userStore

const regData = reactive(clearedForm())

const error = ref('')

onMounted(() => {
    document.title = 'Зарегистрироваться'
})

function clearedForm() {
    return {
        name: null,
        email: null,
        phone: null,
        password: null,
        role: DEFAULT_ROLE
    }
}

async function register() {
    error.value = ""

    if (!regData.name || !regData.email || !regData.password) {
        processAuthError(regData, clearedForm, error, "Пожалуйста, заполните все поля")
        return;
    }

    const exists = await userApi.identifyUserByEmail(regData.email);
    if (exists) {
        processAuthError(regData, clearedForm, error, "Пользователь с таким email уже зарегистрирован")
        return;
    }

    try {
        await createUser(regData)
        router.push('/login');
    } catch (e) {
        console.error(e);
        processAuthError(regData, clearedForm, error, "Ошибка регистрации, попробуйте позже")
    }
}
</script>

<style src="../assets/auth.css" lang="css" scoped></style>
