import { ref } from "vue";
import { http } from "../api/http";
import { getCurrentUser, setCurrentUser } from "../services/authStorage";

export function useProfile() {
  const loading = ref(false);
  const error = ref(null);

  const user = ref(getCurrentUser());

  const updateProfile = async ({ name, email }) => {
    if (!user.value?.id) return false;

    loading.value = true;
    error.value = null;

    try {
      const { data } = await http.patch(`/users/${user.value.id}`, { name, email });
      user.value = data;
      setCurrentUser(data);
      return true;
    } catch (e) {
      error.value = "Не удалось сохранить профиль";
      return false;
    } finally {
      loading.value = false;
    }
  };

  return { user, loading, error, updateProfile };
}
