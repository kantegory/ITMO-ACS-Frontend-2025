<script setup>
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const props = defineProps({
  profile: { type: Object, required: true },
  loading: { type: Boolean, default: false },
});

const auth = useAuthStore();
const router = useRouter();

function logout() {
  auth.logout();
  router.push("/");
}

function safe(v) {
  return v ?? "—";
}
</script>

<template>
  <div class="card">
    <div class="card-body">
      <h2 class="h5">Профиль</h2>

      <p class="mb-1">
        <strong>Имя: </strong>
        <span>{{ loading ? "…" : safe(profile.firstName + " " + profile.lastName) }}</span>
      </p>
      <p class="mb-1">
        <strong>Почта: </strong>
        <span>{{ loading ? "…" : safe(profile.mail) }}</span>
      </p>
      <p class="mb-3">
        <strong>Телефон: </strong>
        <span>{{ loading ? "…" : safe(profile.phone) }}</span>
      </p>

      <button
        type="button"
        class="btn btn-outline-danger w-100"
        @click="logout"
        aria-label="Выйти из аккаунта"
      >
        Выйти
      </button>
    </div>
  </div>
</template>
