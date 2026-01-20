import { defineStore } from "pinia";
import { authApi, usersApi } from "@/api";
import { useApiError } from "@/composables/useApiError";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        token: localStorage.getItem("accessToken") || null,
        user: null,
        error: null,
        loading: false
    }),

    persist: {
        key: "rental_auth",
        paths: ["token", "user"]
    },

    getters: {
        isAuthed: (s) => Boolean(s.token)
    },

    actions: {
        async register(payload) {
            const { normalize } = useApiError();
            this.error = null;
            this.loading = true;

            try {
                await authApi.register(payload);
                return true;
            } catch (e) {
                this.error = normalize(e, "Ошибка регистрации");
                return false;
            } finally {
                this.loading = false;
            }
        },

        async login(payload) {
            const { normalize } = useApiError();
            this.error = null;
            this.loading = true;

            try {
                const res = await authApi.login(payload);
                const token = res?.data?.token || null;

                this.token = token;

                if (token) localStorage.setItem("accessToken", token);
                else localStorage.removeItem("accessToken");

                const me = await usersApi.me();
                this.user = me?.data || null;

                return true;
            } catch (e) {
                this.token = null;
                this.user = null;
                localStorage.removeItem("accessToken");
                this.error = normalize(e, "Ошибка входа");
                return false;
            } finally {
                this.loading = false;
            }
        },

        async fetchMe() {
            try {
                const me = await usersApi.me();
                this.user = me?.data || null;
                return true;
            } catch {
                return false;
            }
        },

        logout() {
            this.token = null;
            this.user = null;
            this.error = null;
            localStorage.removeItem("accessToken");
        }
    }
});

export default useAuthStore;