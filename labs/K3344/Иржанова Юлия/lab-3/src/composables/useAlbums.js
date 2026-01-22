import { ref } from "vue";
import { http } from "../api/http";

export function useAlbums() {
  const albums = ref([]);
  const album = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const fetchAlbums = async () => {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await http.get("/albums");
      albums.value = data;
    } catch (e) {
      error.value = e?.message ?? "Failed to fetch albums";
    } finally {
      loading.value = false;
    }
  };

  const fetchAlbumById = async (id) => {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await http.get(`/albums/${id}`);
      album.value = data;
    } catch (e) {
      error.value = e?.message ?? "Failed to fetch album";
    } finally {
      loading.value = false;
    }
  };

  return { albums, album, loading, error, fetchAlbums, fetchAlbumById };
}
