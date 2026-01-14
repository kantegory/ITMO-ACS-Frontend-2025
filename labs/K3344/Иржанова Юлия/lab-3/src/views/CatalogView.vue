<template>
  <div class="container-fluid">
    <div class="row">
      <FiltersPanel
        v-model="filters"
        :genres="availableGenres"
        :minYear="minYear"
        :maxYear="maxYear"
      />

      <section class="col-lg-9" aria-labelledby="albumsHeading">
        <h1 id="albumsHeading" class="mb-4">Популярные альбомы</h1>

        <div v-if="loading" class="alert alert-info">Загрузка...</div>
        <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

        <div v-else class="row" id="albumsList">
          <AlbumCard v-for="a in filteredAlbums" :key="a.id" :album="a" />

          <div v-if="filteredAlbums.length === 0" class="col-12">
            <div class="alert alert-warning mb-0">
              Ничего не найдено. Попробуй изменить фильтры.
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useAlbums } from "../composables/useAlbums";
import AlbumCard from "../components/AlbumCard.vue";
import FiltersPanel from "../components/FiltersPanel.vue";

const { albums, loading, error, fetchAlbums } = useAlbums();

const filters = ref({
  selectedGenres: [],
  minYear: 1960,
  minRating: 0,
});

const minYear = computed(() => {
  if (!albums.value.length) return 1960;
  return Math.min(...albums.value.map((a) => a.year));
});

const maxYear = computed(() => {
  if (!albums.value.length) return new Date().getFullYear();
  return Math.max(...albums.value.map((a) => a.year));
});

const availableGenres = computed(() => {
  const set = new Set();
  for (const a of albums.value) {
    String(a.genre)
      .split(",")
      .map((g) => g.trim())
      .filter(Boolean)
      .forEach((g) => set.add(g));
  }
  return [...set].sort((a, b) => a.localeCompare(b));
});

const filteredAlbums = computed(() => {
  return albums.value.filter((a) => {
    const okYear = a.year >= filters.value.minYear;
    const okRating = a.rating >= filters.value.minRating;

    const albumGenres = String(a.genre)
      .split(",")
      .map((g) => g.trim())
      .filter(Boolean);

    const okGenre =
      filters.value.selectedGenres.length === 0 ||
      filters.value.selectedGenres.some((g) => albumGenres.includes(g));

    return okYear && okRating && okGenre;
  });
});

onMounted(async () => {
  await fetchAlbums();
  filters.value.minYear = minYear.value;
});
</script>
