<script setup>
import { computed } from "vue";

const props = defineProps({
  card: { type: Object, required: true },
});

const img = computed(() => props.card.image || "https://picsum.photos/400/250");
const title = computed(() => props.card.title || "Без названия");
</script>

<template>
  <article class="col-md-4 property-card">
    <div class="card h-100 shadow-sm">
      <div class="ratio ratio-16x9">
        <img
          :src="img"
          :alt="title"
          class="w-100 h-100 object-fit-cover"
          loading="lazy"
        />
      </div>

      <div class="card-body d-flex flex-column">
        <h3 class="h6 card-title mb-2">
          {{ title }}
        </h3>

        <div class="fw-semibold fs-5 mb-1">
          {{ card.priceText }}
        </div>

        <div
          v-if="card.location"
          class="text-muted d-flex align-items-center gap-1 mb-2"
        >
          <svg width="14" height="14" aria-hidden="true">
            <use href="#icon-location"></use>
          </svg>
          <span>{{ card.location }}</span>
        </div>

        <p class="card-text text-muted flex-grow-1 mb-2">
          {{ card.description || "" }}
        </p>
        <RouterLink
          class="btn btn-outline-primary btn-sm align-self-start"
          :to="`/advertisements/${card.id}`"
        >
          Подробнее
        </RouterLink>
      </div>
    </div>
  </article>
</template>

<style scoped>
.card-title {
  line-height: 1.3;
}
</style>
