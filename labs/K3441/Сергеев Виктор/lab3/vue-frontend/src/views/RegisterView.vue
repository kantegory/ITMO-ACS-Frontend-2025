<template>
    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-md-7">
                <div class="card shadow" role="form">
                    <div class="card-body">
                        <h3 class="mb-3">Регистрация</h3>
                        <AlertComponent :message="errorMessage" type="danger" />
                        <form @submit.prevent="handleSubmit" novalidate>
                            <div class="row">
                                <div class="mb-3">
                                    <label for="username" class="form-label">
                                        Имя пользователя (мин. 8 символов)
                                    </label>
                                    <input
                                        id="username"
                                        v-model="username"
                                        class="form-control"
                                        type="username"
                                        required
                                        minlength="8"
                                        autocomplete="username"
                                        aria-required="true"
                                        aria-describedby="usernameHelp"
                                    />
                                    <small id="usernameHelp" class="form-text text-muted visually-hidden">
                                        Введите имя пользователя. Длина имени - минимум 8 символов.
                                    </small>
                                </div>
                                <div class="mb-3">
                                    <label for="password" class="form-label">
                                        Пароль (мин. 8 символов)
                                    </label>
                                    <input
                                        id="password"
                                        v-model="password"
                                        class="form-control"
                                        type="password"
                                        required
                                        autocomplete="new-password"
                                        minlength="8"
                                        aria-required="true"
                                        aria-describedby="passwordHelp"
                                    />
                                    <small id="passwordHelp" class="form-text text-muted visually-hidden">
                                        Введите пароль. Длина пароля - минимум 8 символов.
                                    </small>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="password-confirm" class="form-label">
                                    Повторите пароль
                                </label>
                                <input
                                    id="password-confirm"
                                    v-model="passwordConfirm"
                                    class="form-control"
                                    type="password"
                                    required
                                    autocomplete="password-confirm"
                                    minlength="8"
                                    aria-required="true"
                                    aria-describedby="passwordConfirmHelp"
                                />
                                <small id="passwordConfirmHelp" class="form-text text-muted visually-hidden">
                                    Повторите введённый пароль.
                                </small>
                            </div>
                            
                            <button
                                class="btn btn-primary w-100" 
                                type="submit"
                                aria-label="Зарегистрировать аккаунт" 
                                :disabled="isLoading"
                            >
                                {{ isLoading ? 'Регистрация...' : 'Зарегистрироваться' }}
                            </button>
                        </form>
                        <hr />
                        <p class="small mb-0">
                            Уже есть аккаунт?
                            <router-link to="/login"
                                aria-label="Переход на страницу входа в аккаунт">
                                Войти
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
const { register, isLoading } = useAuth();
const username = ref('');
const password = ref('');
const passwordConfirm = ref('');
const errorMessage = ref('');
async function handleSubmit() {
    errorMessage.value = '';
    if (!username.value || !password.value || !passwordConfirm.value) {
        errorMessage.value = 'Все поля обязательны';
        return;
    }
    const result = await register(
        username.value,
        password.value,
        passwordConfirm.value,
    );
    if (result.success) {
        const redirect = route.query.redirect || '/profile?mode=me';
        router.push(redirect);
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