import { defineStore } from "pinia";
import { usersApi, bookingsApi, propertiesApi } from "@/api";
import { useApiError } from "@/composables/useApiError";
import { useAuthStore } from "@/stores/auth";

export const useProfileStore = defineStore("profile", {
    state: () => ({
        loading: false,
        error: null,
        bookings: [],
        ownedProperties: []
    }),

    actions: {
        async loadBookings() {
            const { normalize } = useApiError();
            const auth = useAuthStore();

            this.error = null;
            this.loading = true;

            try {
                const userId = auth.user?.user_id || auth.user?.id;
                if (!userId) {
                    this.bookings = [];
                    return true;
                }

                const res = await bookingsApi.getByUserId(userId);
                this.bookings = Array.isArray(res?.data) ? res.data : [];
                return true;
            } catch (e) {
                this.bookings = [];
                this.error = normalize(e, "Не удалось загрузить бронирования");
                return false;
            } finally {
                this.loading = false;
            }
        },

        async loadOwnedProperties() {
            const { normalize } = useApiError();
            const auth = useAuthStore();

            this.error = null;
            this.loading = true;

            try {
                const userId = auth.user?.user_id || auth.user?.id;
                if (!userId) {
                    this.ownedProperties = [];
                    return true;
                }

                const res = await propertiesApi.getAll({ ownerId: userId });
                this.ownedProperties = Array.isArray(res?.data) ? res.data : [];
                return true;
            } catch (e) {
                this.ownedProperties = [];
                this.error = normalize(e, "Не удалось загрузить ваши объявления");
                return false;
            } finally {
                this.loading = false;
            }
        },

        async updateProfile(id, payload) {
            const { normalize } = useApiError();
            this.error = null;
            this.loading = true;

            try {
                const res = await usersApi.update(id, payload);
                return res?.data || null;
            } catch (e) {
                this.error = normalize(e, "Не удалось обновить профиль");
                return null;
            } finally {
                this.loading = false;
            }
        }
    }
});

export default useProfileStore;