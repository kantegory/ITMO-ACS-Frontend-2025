<template>
    <AppNavbar />

    <BaseLayout>
        <div class="row justify-content-center">
            <div class="col-12 col-md-7 col-lg-6">
                <h1 class="h3 mb-3">Регистрация</h1>

                <div v-if="auth.error" class="alert alert-danger" role="alert">
                    {{ auth.error }}
                </div>

                <div v-if="success" class="alert alert-success" role="status">
                    Аккаунт создан. Теперь можно войти.
                </div>

                <form class="card card-body" @submit.prevent="onSubmit">
                    <div class="mb-3">
                        <label class="form-label">Имя</label>
                        <input v-model="form.name" type="text" class="form-control" required />
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Email</label>
                        <input v-model="form.email" type="email" class="form-control" required />
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Пароль</label>
                        <input v-model="form.password" type="password" class="form-control" required />
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Телефон</label>
                        <input v-model="form.phone" type="tel" class="form-control" />
                    </div>

                    <button class="btn btn-primary" type="submit" :disabled="auth.loading">
                        Зарегистрироваться
                    </button>

                    <RouterLink class="d-block mt-3" to="/signin">
                        Уже есть аккаунт? Войти
                    </RouterLink>
                </form>
            </div>
        </div>
    </BaseLayout>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useAuthStore } from "@/stores/auth";

import BaseLayout from "@/layouts/BaseLayout.vue";
import AppNavbar from "@/components/AppNavbar.vue";

const auth = useAuthStore();
const success = ref(false);

const form = reactive({
    name: "",
    email: "",
    password: "",
    phone: ""
});

async function onSubmit() {
    success.value = false;

    const ok = await auth.register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password.trim(),
        phone: form.phone.trim() || null
    });

    if (ok) {
        success.value = true;
        form.name = "";
        form.email = "";
        form.password = "";
        form.phone = "";
    }
}
</script>