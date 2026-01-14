import { computed } from "vue";
import { useAuth } from "./useAuth";

function readAlbums() {
  return JSON.parse(localStorage.getItem("albums") || "[]");
}

function writeAlbums(albums) {
  localStorage.setItem("albums", JSON.stringify(albums));
}

function ensureAlbum(albums, apiAlbum) {
  const idx = albums.findIndex((a) => a.id === apiAlbum.id);
  if (idx !== -1) return albums;

  return [
    ...albums,
    {
      id: apiAlbum.id,
      albumTitle: apiAlbum.albumTitle,
      artist: apiAlbum.artist,
      year: apiAlbum.year,
      coverUrl: apiAlbum.coverUrl,
      reviews: [],
    },
  ];
}

export function useReviews() {
  const { user, isAuthenticated } = useAuth();

  const addReview = ({ album, rating, text }) => {
    if (!isAuthenticated.value) return false;
    if (!album?.id) return false;

    const r = Number(rating);
    if (!Number.isFinite(r) || r < 0 || r > 10) return false;

    const albums = ensureAlbum(readAlbums(), album);
    const idx = albums.findIndex((a) => a.id === album.id);
    const target = albums[idx];

    const review = {
      author: user.value.name,
      rating: r,
      text: String(text ?? "").trim(),
      createdAt: new Date().toISOString(),
    };

    const updated = {
      ...target,
      reviews: [...(target.reviews || []), review],
    };

    const next = [...albums];
    next[idx] = updated;
    writeAlbums(next);

    return true;
  };

  const getAlbumReviews = (albumId) => {
    const albums = readAlbums();
    const a = albums.find((x) => x.id === albumId);
    return a?.reviews || [];
  };

  const getUserReviews = computed(() => {
    if (!user.value?.name) return [];

    const albums = readAlbums();
    const out = [];

    for (const a of albums) {
      for (const r of a.reviews || []) {
        if (r.author === user.value.name) {
          out.push({
            ...r,
            albumId: a.id,
            albumTitle: a.albumTitle,
            artist: a.artist,
          });
        }
      }
    }

    return out;
  });

  return { addReview, getAlbumReviews, getUserReviews, isAuthenticated };
}
