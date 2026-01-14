<template>
  <section class="container">
    <h1 class="mb-4">Каталог</h1>

    <div v-if="loading" class="alert alert-info">Загрузка...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <ul v-else class="list-group">
      <li v-for="a in albums" :key="a.id" class="list-group-item">
        {{ a.albumTitle }} — {{ a.artist }} ({{ a.year }}) • {{ a.rating }}
      </li>
    </ul>
  </section>
</template>

<script setup>
import { onMounted } from "vue";
import { useAlbums } from "../composables/useAlbums";

const { albums, loading, error, fetchAlbums } = useAlbums();

onMounted(fetchAlbums);
</script>
