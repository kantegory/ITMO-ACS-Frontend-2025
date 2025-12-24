<script setup>
import PropertyCard from "./PropertyCard.vue";

defineProps({
  cards: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  error: { type: String, default: null },
});
</script>

<template>
  <div v-if="loading" class="text-muted">Загрузка…</div>
  <div v-else-if="error" class="text-danger">{{ error }}</div>
  <p v-else-if="!cards || cards.length === 0" class="text-muted">
    Объявлений не найдено.
  </p>

  <div v-else class="row g-3">
    <PropertyCard v-for="c in cards" :key="c.id" :card="c" />
  </div>
</template>
