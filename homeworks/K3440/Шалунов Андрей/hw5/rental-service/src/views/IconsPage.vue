<template>
    <AppNavbar />

    <BaseLayout>
        <h1 class="h3 mb-3 d-flex align-items-center gap-2">
            <IconSvg name="grid" />
            Иконки
        </h1>

        <div class="row g-3">
            <div v-for="name in iconNames" :key="name" class="col-6 col-md-3 col-lg-2">
                <div class="card card-body text-center">
                    <div class="mb-2">
                        <IconSvg :name="name" />
                    </div>
                    <div class="small text-muted">{{ name }}</div>
                </div>
            </div>
        </div>
    </BaseLayout>
</template>

<script setup>
import AppNavbar from "@/components/AppNavbar.vue";
import BaseLayout from "@/layouts/BaseLayout.vue";
import IconSvg from "@/components/IconSvg.vue";

const iconNames = [
    "home",
    "search",
    "user",
    "logout",
    "grid",
    "moon",
    "sun",
    "plus",
    "message",
    "phone"
];
</script>