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
        <h2 class="h5">Отзывы</h2>
        <div v-if="albumReviews.length === 0" class="text-muted mb-3">
          Пока нет отзывов
        </div>

        <ul v-else class="list-group mb-4">
          <li v-for="(r, idx) in albumReviews" :key="idx" class="list-group-item">
            <div class="d-flex justify-content-between">
              <strong>{{ r.author }}</strong>
              <span class="badge text-bg-warning">★ {{ r.rating }}</span>
            </div>
            <div v-if="r.text" class="mt-2">{{ r.text }}</div>
          </li>
        </ul>

        <div class="card">
          <div class="card-body">
            <h3 class="h6 mb-3">Оставить отзыв</h3>

            <div v-if="!reviewsAuth" class="text-muted">
              Войдите, чтобы оставлять отзывы
            </div>

            <form v-else @submit.prevent="submitReview">
              <div class="mb-3">
                <label class="form-label" for="rating">Оценка (0–10)</label>
                <input
                  id="rating"
                  v-model.number="reviewForm.rating"
                  class="form-control"
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  required
                />
              </div>

              <div class="mb-3">
                <label class="form-label" for="text">Текст</label>
                <textarea
                  id="text"
                  v-model.trim="reviewForm.text"
                  class="form-control"
                  rows="3"
                ></textarea>
              </div>

              <button class="btn btn-primary" type="submit">Отправить</button>
            </form>
          </div>
        </div>

              </div>
            </div>

            <div v-else class="alert alert-warning">Альбом не найден</div>
          </div>
        </template>

        <script setup>
        import { watch, reactive, computed } from "vue";
        import { RouterLink, useRoute } from "vue-router";
        import { useAlbums } from "../composables/useAlbums";
        import { useFavorites } from "../composables/useFavorites";
        import { useReviews } from "../composables/useReviews";

        const route = useRoute();
        const { album, loading, error, fetchAlbumById } = useAlbums();
        const { isFavorite, toggle, isAuthenticated } = useFavorites();
        const { addReview, getAlbumReviews, isAuthenticated: reviewsAuth } = useReviews();
        const reviewForm = reactive({ rating: 8, text: "" });

        const albumReviews = computed(() => {
          if (!album.value?.id) return [];
          return getAlbumReviews(album.value.id);
        });

        function submitReview() {
          if (!album.value) return;

          const ok = addReview({
            album: album.value,
            rating: reviewForm.rating,
            text: reviewForm.text,
          });

          if (ok) {
            reviewForm.text = "";
          }
        }

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
