<template>
  <div class="col-md-6 col-xl-4 mb-4">
    <RouterLink
      class="text-decoration-none text-reset"
      :to="{ name: 'album', params: { id: album.id } }"
    >
      <div class="card h-100">
        <img
          :src="album.coverUrl"
          class="card-img-top"
          :alt="`${album.albumTitle} cover`"
          loading="lazy"
        />

        <div class="card-body d-flex flex-column">
          <h3 class="h6 card-title mb-1">{{ album.albumTitle }}</h3>
          <div class="text-muted mb-2">{{ album.artist }} • {{ album.year }}</div>

          <div class="mt-auto">
            <span class="badge text-bg-warning">★ {{ album.rating }}</span>
          </div>
        </div>
      </div>
    </RouterLink>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";

defineProps({
  album: {
    type: Object,
    required: true,
  },
});
</script>
