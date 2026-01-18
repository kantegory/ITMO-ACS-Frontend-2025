import { defineStore } from "pinia";
import { propertiesApi, bookingsApi } from "@/api";
import { useApiError } from "@/composables/useApiError";

export const usePropertyDetailsStore = defineStore("propertyDetails", {
    state: () => ({
        property: null,
        photos: [],
        loading: false,
        error: null
    }),

    actions: {
        async load(id) {
            const { normalize } = useApiError();
            this.error = null;
            this.loading = true;

            try {
                const res = await propertiesApi.getById(id);
                this.property = res?.data || null;

                const photosRes = await propertiesApi.getPhotosByProperty(id);
                const ph = Array.isArray(photosRes?.data) ? photosRes.data : [];
                this.photos = ph.map((x) => x.photo_url).filter(Boolean);

                if (this.photos.length === 0) {
                    this.photos = ["https://via.placeholder.com/800x500?text=Нет+фото"];
                }

                return true;
            } catch (e) {
                this.property = null;
                this.photos = [];
                this.error = normalize(e, "Не удалось загрузить объявление");
                return false;
            } finally {
                this.loading = false;
            }
        },

        async createBooking(payload) {
            const { normalize } = useApiError();
            try {
                const res = await bookingsApi.create(payload);
                return res?.data || true;
            } catch (e) {
                throw new Error(normalize(e, "Не удалось создать бронирование"));
            }
        },
    }
});

export default usePropertyDetailsStore;