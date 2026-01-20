<template>
    <AppNavbar />
    <BaseLayout>
        <h1 class="h3 mb-2">Страница не найдена</h1>
        <p class="text-muted">Проверьте адрес или вернитесь на поиск.</p>
        <RouterLink class="btn btn-primary" to="/search">К поиску</RouterLink>
    </BaseLayout>
</template>

<script setup>
import AppNavbar from "@/components/AppNavbar.vue";
import BaseLayout from "@/layouts/BaseLayout.vue";
</script>