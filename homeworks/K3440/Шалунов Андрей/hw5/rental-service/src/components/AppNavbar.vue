<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary shadow-sm">
        <div class="container">
            <RouterLink class="navbar-brand" to="/search">
                Rental
            </RouterLink>

            <div class="d-flex align-items-center gap-2">
                <RouterLink class="btn btn-outline-primary btn-sm" to="/search">
                    Поиск
                </RouterLink>

                <RouterLink class="btn btn-outline-primary btn-sm" to="/my-properties">
                    Мои объявления
                </RouterLink>

                <RouterLink class="btn btn-outline-primary btn-sm" to="/profile">
                    Профиль
                </RouterLink>

                <button
                    v-if="auth.isAuthed"
                    class="btn btn-outline-secondary btn-sm"
                    type="button"
                    @click="onLogout"
                >
                    Выйти
                </button>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const auth = useAuthStore();

function onLogout() {
    auth.logout();
    router.push("/signin");
}
</script>