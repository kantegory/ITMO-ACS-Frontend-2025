<template>
    <nav class="navbar navbar-expand-lg border-bottom shadow-sm">
        <div class="container py-2 d-flex align-items-center gap-2 flex-wrap">
            <RouterLink class="navbar-brand" to="/search">Rental</RouterLink>

            <button
                class="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1"
                type="button"
                @click="toggleTheme"
            >
                <IconSvg :name="theme === 'dark' ? 'sun' : 'moon'" />
                <span>{{ theme === "dark" ? "Светлая тема" : "Тёмная тема" }}</span>
            </button>

            <RouterLink class="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1" to="/search">
                <IconSvg name="search" /> Поиск
            </RouterLink>

            <RouterLink class="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1" to="/my-properties">
                <IconSvg name="home" /> Мои объявления
            </RouterLink>

            <RouterLink class="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1" to="/profile">
                <IconSvg name="user" /> Профиль
            </RouterLink>

            <button
                v-if="auth.isAuthed"
                class="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1 ms-auto"
                type="button"
                @click="onLogout"
            >
                <IconSvg name="logout" /> Выйти
            </button>
        </div>
    </nav>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useTheme } from "@/composables/useTheme";
import IconSvg from "@/components/IconSvg.vue";

const router = useRouter();
const auth = useAuthStore();
const { theme, toggleTheme } = useTheme();

function onLogout() {
    auth.logout();
    router.push("/signin");
}
</script>