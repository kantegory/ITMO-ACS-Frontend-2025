import { ref, computed } from "vue";
import { http } from "../api/http";
import {
  getCurrentUser,
  getToken,
  logout as logoutStorage,
  setCurrentUser,
  setToken,
} from "../services/authStorage";

const user = ref(getCurrentUser());
const token = ref(getToken());

export function useAuth() {
  const loading = ref(false);
  const error = ref(null);

  const isAuthenticated = computed(() => Boolean(token.value));

  const login = async ({ email, password }) => {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await http.post("/login", { email, password });
      token.value = data.accessToken;
      user.value = data.user;
      setToken(data.accessToken);
      setCurrentUser(data.user);
      return true;
    } catch (e) {
      error.value = "Неверный email или пароль";
      return false;
    } finally {
      loading.value = false;
    }
  };

  const register = async ({ name, email, password }) => {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await http.post("/register", { name, email, password });
      token.value = data.accessToken;
      user.value = data.user;
      setToken(data.accessToken);
      setCurrentUser(data.user);
      return true;
    } catch (e) {
      error.value = "Ошибка регистрации";
      return false;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    logoutStorage();
    token.value = null;
    user.value = null;
  };

  return { user, token, isAuthenticated, loading, error, login, register, logout };
}
