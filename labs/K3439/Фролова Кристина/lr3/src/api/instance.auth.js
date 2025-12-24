import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { isTokenExpired } from "@/utils/jwt.js";

const apiAuth = axios.create({
  baseURL: "http://localhost:8080/v1",
});

apiAuth.interceptors.request.use((config) => {
  const auth = useAuthStore();

  if (auth.accessToken && isTokenExpired(auth.accessToken)) {
    auth.logout();
    return config;
  }

  if (auth.accessToken) {
    const type = auth.tokenType || "Bearer";
    config.headers.Authorization = `${type} ${auth.accessToken}`;
  }

  return config;
});

apiAuth.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      const auth = useAuthStore();
      auth.logout();
    }
    return Promise.reject(error);
  }
);

export default apiAuth;
