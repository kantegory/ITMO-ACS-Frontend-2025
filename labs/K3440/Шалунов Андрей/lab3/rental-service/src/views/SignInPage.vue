<template>
    <BaseLayout>
        <div class="row justify-content-center">
            <div class="col-12 col-md-6 col-lg-5">
                <h1 class="h3 mb-3">Вход</h1>

                <div v-if="auth.error" class="alert alert-danger" role="alert">
                    {{ auth.error }}
                </div>

                <form class="card card-body" @submit.prevent="onSubmit">
                    <div class="mb-3">
                        <label class="form-label">Email</label>
                        <input v-model="form.email" type="email" class="form-control" required />
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Пароль</label>
                        <input v-model="form.password" type="password" class="form-control" required />
                    </div>

                    <button class="btn btn-primary" type="submit" :disabled="auth.loading">
                        Войти
                    </button>

                    <RouterLink class="d-block mt-3" to="/register">
                        Нет аккаунта? Регистрация
                    </RouterLink>
                </form>
            </div>
        </div>
    </BaseLayout>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import BaseLayout from "@/layouts/BaseLayout.vue";

const router = useRouter();
const auth = useAuthStore();

const form = reactive({ email: "", password: "" });

async function onSubmit() {
    const ok = await auth.login({
        email: form.email.trim(),
        password: form.password.trim()
    });

    if (ok) router.push("/search");
}
</script>