<template>
  <div class="container">
    <h1 class="mb-4">Профиль</h1>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div class="card mb-4">
      <div class="card-body">
        <div class="d-flex flex-wrap align-items-start justify-content-between gap-3">
          <div>
            <div class="text-muted">Имя</div>
            <div class="h5 mb-2">{{ user?.name }}</div>

            <div class="text-muted">Email</div>
            <div class="mb-0">{{ user?.email }}</div>
          </div>

          <button class="btn btn-outline-primary" type="button" @click="openEdit">
            Редактировать
          </button>
        </div>
      </div>
    </div>

    <div class="row g-3">
      <div class="col-lg-4">
        <div class="card h-100">
          <div class="card-body">
            <h2 class="h5">Мои отзывы</h2>

            <div v-if="getUserReviews.length === 0" class="text-muted">
              Вы пока не оставили ни одного отзыва
            </div>

            <ul v-else class="list-group">
              <li v-for="(r, idx) in getUserReviews" :key="idx" class="list-group-item">
                <div class="d-flex justify-content-between">
                  <span>{{ r.artist }} — {{ r.albumTitle }}</span>
                  <span class="badge text-bg-warning">★ {{ r.rating }}</span>
                </div>
                <div v-if="r.text" class="mt-2">{{ r.text }}</div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card h-100">
          <div class="card-body">
            <h2 class="h5">Избранные альбомы</h2>

            <div v-if="favoriteAlbums.length === 0" class="text-muted">
              Нет избранных альбомов
            </div>

            <ul v-else class="list-group">
              <li v-for="a in favoriteAlbums" :key="a.id" class="list-group-item">
                {{ a.albumTitle }} — {{ a.artist }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card h-100">
          <div class="card-body">
            <h2 class="h5">Плейлисты</h2>
            <div class="text-muted">Скоро будут доступны</div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="editOpen" class="modal fade show d-block" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title h5 mb-0">Редактировать профиль</h3>
            <button type="button" class="btn-close" aria-label="Close" @click="closeEdit"></button>
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label" for="name">Имя</label>
              <input id="name" v-model.trim="form.name" class="form-control" />
            </div>

            <div class="mb-3">
              <label class="form-label" for="email">Email</label>
              <input id="email" v-model.trim="form.email" class="form-control" type="email" />
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeEdit">
              Отмена
            </button>
            <button type="button" class="btn btn-primary" :disabled="loading" @click="save">
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="editOpen" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import { useProfile } from "../composables/useProfile";
import { useFavorites } from "../composables/useFavorites";
import { useAlbums } from "../composables/useAlbums";
import { useReviews } from "../composables/useReviews";

const { user, loading, error, updateProfile } = useProfile();

const editOpen = ref(false);
const form = reactive({ name: "", email: "" });

const { getUserReviews } = useReviews();

function openEdit() {
  form.name = user.value?.name ?? "";
  form.email = user.value?.email ?? "";
  editOpen.value = true;
}

function closeEdit() {
  editOpen.value = false;
}

async function save() {
  const ok = await updateProfile({ name: form.name, email: form.email });
  if (ok) closeEdit();
}

const { favorites } = useFavorites();
const { albums, fetchAlbums } = useAlbums();

const favoriteAlbums = computed(() =>
  albums.value.filter((a) => favorites.value.includes(a.id))
);

onMounted(fetchAlbums);
</script>
