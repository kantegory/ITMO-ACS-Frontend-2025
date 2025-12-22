<template>
    <AppNavbar />

    <BaseLayout>
        <h1 class="h3 mb-3">Личный кабинет</h1>

        <div v-if="auth.user" class="card card-body">
            <p class="mb-1">
                <strong>Имя:</strong>
                {{ auth.user.name || "-" }}
            </p>

            <p class="mb-1">
                <strong>Email:</strong>
                {{ auth.user.email || "-" }}
            </p>

            <p class="mb-0">
                <strong>Телефон:</strong>
                {{ auth.user.phone || "-" }}
            </p>
        </div>

        <div v-else class="text-muted">
            Загружаем профиль...
        </div>
    </BaseLayout>
</template>

<script setup>
import { onMounted } from "vue";
import AppNavbar from "@/components/AppNavbar.vue";
import BaseLayout from "@/layouts/BaseLayout.vue";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();

onMounted(async () => {
    if (!auth.user) {
        await auth.fetchMe();
    }
});
</script>