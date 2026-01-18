import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const apiURL = "http://localhost:8000/api";

const instance = axios.create({
    baseURL: apiURL
});

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

instance.interceptors.response.use(
    (res) => res,
    (error) => {
        const status = error?.response?.status;
        if (status === 401) {
            try {
                const auth = useAuthStore();
                auth.logout();
            } catch {
                localStorage.removeItem("accessToken");
            }
        }
        return Promise.reject(error);
    }
);

export default instance;