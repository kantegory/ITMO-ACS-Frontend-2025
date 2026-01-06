<template>
    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card shadow" role="form">
                    <div class="card-body">
                        <h3 class="mb-3">Вход</h3>
                        <AlertComponent :message="errorMessage" type="danger" />
                        <form @submit.prevent="handleSubmit" novalidate>
                            <div class="mb-3">
                                <label for="username" class="form-label">
                                    Имя пользователя
                                </label>
                                <input
                                    id="username"
                                    v-model="username"
                                    class="form-control"
                                    type="username"
                                    required
                                    autocomplete="username"
                                    minlength="8"
                                    aria-required="true"
                                    aria-describedby="usernameHelp"
                                />
                                <small id="usernameHelp" class="form-text text-muted visually-hidden">
                                    Введите имя пользователя. Длина имени - минимум 8 символов.
                                </small>
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">
                                    Пароль
                                </label>
                                <input
                                    id="password"
                                    v-model="password"
                                    class="form-control"
                                    type="password"
                                    required
                                    autocomplete="current-password"
                                    minlength="8"
                                    aria-required="true"
                                    aria-describedby="passwordHelp"
                                />
                                <small id="passwordHelp" class="form-text text-muted visually-hidden">
                                    Введите пароль от аккаунта. Длина пароля - минимум 8 символов.
                                </small>
                            </div>
                            <button class="btn btn-primary w-100" type="submit" :disabled="isLoading">
                                {{ isLoading ? 'Вход...' : 'Войти' }}
                            </button>
                        </form>
                        <hr />
                        <p class="small mb-0">
                            Нет аккаунта?
                            <router-link to="/register"
                                aria-label="Переход на страницу регистрации нового аккаунта">
                                Зарегистрироваться
                            </router-link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import AlertComponent from '@/components/AlertComponent.vue';
const route = useRoute();
const router = useRouter();
const { login, isLoading } = useAuth();
const username = ref('');
const password = ref('');
const errorMessage = ref('');
async function handleSubmit() {
    errorMessage.value = '';
    if (!username.value || !password.value) {
        errorMessage.value = 'Имя пользователя и пароль обязательны';
        return;
    }
    const result = await login(username.value, password.value);
    if (result.success) {
        const redirect = route.query.redirect || '/profile?mode=me';
        await router.push(redirect);
    } else {
        errorMessage.value = result.error;
    }
}
</script>

<style scoped>
.card {
    background-color: var(--card-bg);
}
</style>