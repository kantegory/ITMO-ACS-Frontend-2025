import { ref } from 'vue';

const API_BASE_URL = 'http://localhost:4000';
const STORAGE_USER_KEY = 'good-fitness-user';

const currentUser = ref(loadUserFromStorage());

function loadUserFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('Не удалось прочитать данные пользователя', error);
    return null;
  }
}

function sanitizeUser(user) {
  if (!user) {
    return null;
  }
  const clone = { ...user };
  delete clone.password;
  return clone;
}

function persistUser(user) {
  const safeUser = sanitizeUser(user);
  currentUser.value = safeUser;

  if (safeUser) {
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(safeUser));
  } else {
    localStorage.removeItem(STORAGE_USER_KEY);
  }
}

function logout() {
  persistUser(null);
}

export function useAuth() {
  return {
    currentUser,
    persistUser,
    logout,
    loadUserFromStorage
  };
}

export { API_BASE_URL, persistUser as _persistUser };
