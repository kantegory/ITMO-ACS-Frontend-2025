<script setup>
import { computed, onMounted, ref } from "vue";
import PropertyGrid from "@/components/PropertyGrid.vue";
import useAdvertisementsStore from "@/stores/advertisements";
import { advertisementToCard } from "@/utils/mappers.js";
import AdvertisementFilters from "@/components/AdvertisementFilters.vue";

const store = useAdvertisementsStore();

const loading = ref(false);
const error = ref(null);

const cards = computed(() =>
  store.advertisements.map(advertisementToCard)
);

async function loadCards() {
  loading.value = true;
  error.value = null;

  try {
    await store.loadAdvertisements();
  } catch (e) {
    error.value = e?.message || "Не удалось загрузить объявления";
  } finally {
    loading.value = false;
  }
}

function applyFilters() {
  loadCards();
}

onMounted(loadCards);
</script>

<template>
  <div class="d-flex align-items-center justify-content-between mb-3">
    <h1 class="h3 mb-0">Объявления</h1>
    <button
      class="btn btn-outline-secondary btn-sm"
      @click="loadCards"
      :disabled="loading"
    >
      Обновить
    </button>
  </div>

  <AdvertisementFilters
    v-model="store.filters"
    @apply="applyFilters"
  />

  <PropertyGrid
    :cards="cards"
    :loading="loading"
    :error="error"
  />
</template>
