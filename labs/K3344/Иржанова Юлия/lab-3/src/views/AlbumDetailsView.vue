<template>
  <div class="container">
    <div class="mb-3">
      <RouterLink class="btn btn-outline-secondary" to="/catalog">Назад</RouterLink>
    </div>

    <div v-if="loading" class="alert alert-info">Загрузка...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-else-if="album" class="row g-4">
      <div class="col-md-4">
        <img :src="album.coverUrl" class="img-fluid rounded" :alt="album.albumTitle" />
      </div>

      <div class="col-md-8">
        <h1 class="mb-2">{{ album.albumTitle }}</h1>
        <div class="text-muted mb-3">{{ album.artist }} • {{ album.year }}</div>

        <div class="mb-3">
          <span class="badge text-bg-warning">★ {{ album.rating }}</span>
          <span class="badge text-bg-secondary ms-2">{{ album.genre }}</span>
        </div>
        <button
          class="btn"
          :class="album && isFavorite(album.id) ? 'btn-danger' : 'btn-outline-danger'"
          type="button"
          @click="toggleFav"
          :disabled="!isAuthenticated"
        >
          <span v-if="album && isFavorite(album.id)">Убрать из избранного</span>
          <span v-else>Добавить в избранное</span>
        </button>

        <p class="mb-4">{{ album.description }}</p>

        <h2 class="h5">Треки</h2>
        <ol class="mb-4">
          <li v-for="t in album.tracks" :key="t">{{ t }}</li>
        </ol>
      </div>
    </div>

    <div v-else class="alert alert-warning">Альбом не найден</div>
  </div>
</template>

<script setup>
import { watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { useAlbums } from "../composables/useAlbums";
import { useFavorites } from "../composables/useFavorites";

const route = useRoute();
const { album, loading, error, fetchAlbumById } = useAlbums();
const { isFavorite, toggle, isAuthenticated } = useFavorites();

async function load() {
  await fetchAlbumById(Number(route.params.id));
}

function toggleFav() {
  if (!album.value?.id) return;
  if (!isAuthenticated.value) return;
  toggle(album.value.id);
}

watch(() => route.params.id, load, { immediate: true });
</script>
