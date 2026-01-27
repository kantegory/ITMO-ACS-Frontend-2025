import { ref } from 'vue';
import axios from 'axios';

const API_URL = 'http://localhost:8000';
const token = ref(localStorage.getItem('token') || sessionStorage.getItem('token') || '');

export function useAuth() {
  const login = async ({ email, password, remember }) => {
    try {
      const res = await axios.post(`${API_URL}/auth/token?email=${email}&password=${password}`);
      const t = res.data.access_token || res.data.token;
      token.value = t;
      if (remember) localStorage.setItem('token', t);
      else sessionStorage.setItem('token', t);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const logout = () => {
    token.value = '';
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  };

  const isLoggedIn = () => !!token.value;

  return { token, login, logout, isLoggedIn };
}
