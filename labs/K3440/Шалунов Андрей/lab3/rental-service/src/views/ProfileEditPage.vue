<template>
    <AppNavbar />
    <BaseLayout>
        <h1 class="h3 mb-3">Редактирование профиля</h1>

        <div v-if="profile.error" class="alert alert-danger">{{ profile.error }}</div>
        <div v-if="success" class="alert alert-success" role="status">Изменения сохранены.</div>

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
                <label class="form-label">Телефон</label>
                <input v-model="form.phone" type="tel" class="form-control" />
            </div>

            <div class="d-flex gap-2">
                <button class="btn btn-primary" type="submit" :disabled="profile.loading">Сохранить</button>
                <RouterLink class="btn btn-outline-secondary" to="/profile">Назад</RouterLink>
            </div>
        </form>
    </BaseLayout>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import AppNavbar from "@/components/AppNavbar.vue";
import BaseLayout from "@/layouts/BaseLayout.vue";

import { useAuthStore } from "@/stores/auth";
import { useProfileStore } from "@/stores/profile";

const router = useRouter();
const auth = useAuthStore();
const profile = useProfileStore();
const success = ref(false);

const form = reactive({ name: "", email: "", phone: "" });

onMounted(async () => {
    if (!auth.user) await auth.fetchMe();
    form.name = auth.user?.name || "";
    form.email = auth.user?.email || "";
    form.phone = auth.user?.phone || "";
});

async function onSubmit() {
    success.value = false;

    const id = auth.user?.user_id || auth.user?.id;
    if (!id) return;

    const updated = await profile.updateProfile(id, {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null
    });

    if (updated) {
        auth.user = { ...auth.user, ...updated };
        success.value = true;

        setTimeout(() => {
            router.push("/profile");
        }, 800);

    }
}
</script>