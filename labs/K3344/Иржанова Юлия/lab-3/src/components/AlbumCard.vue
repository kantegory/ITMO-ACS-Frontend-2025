<template>
  <div class="col-md-6 col-xl-4 mb-4">
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
  </div>
</template>

<script setup>
defineProps({
  album: {
    type: Object,
    required: true,
  },
});
</script>
