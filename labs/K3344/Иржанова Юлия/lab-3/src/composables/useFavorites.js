import { computed, ref, watchEffect } from "vue";
import { useAuth } from "./useAuth";

export function useFavorites() {
  const { user, isAuthenticated } = useAuth();

  const key = computed(() => {
    const id = user.value?.id;
    return id ? `favorites_${id}` : null;
  });

  const favorites = ref([]);

  watchEffect(() => {
    if (!isAuthenticated.value || !key.value) {
      favorites.value = [];
      return;
    }

    const raw = localStorage.getItem(key.value);
    favorites.value = raw ? JSON.parse(raw) : [];
  });

  const isFavorite = (albumId) => favorites.value.includes(albumId);

  const add = (albumId) => {
    if (!key.value) return;
    if (favorites.value.includes(albumId)) return;
    favorites.value = [...favorites.value, albumId];
    localStorage.setItem(key.value, JSON.stringify(favorites.value));
  };

  const remove = (albumId) => {
    if (!key.value) return;
    favorites.value = favorites.value.filter((id) => id !== albumId);
    localStorage.setItem(key.value, JSON.stringify(favorites.value));
  };

  const toggle = (albumId) => {
    if (isFavorite(albumId)) remove(albumId);
    else add(albumId);
  };

  return { favorites, isFavorite, add, remove, toggle, isAuthenticated };
}
