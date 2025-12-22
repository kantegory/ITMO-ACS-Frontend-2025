import { defineStore } from "pinia";
import { propertiesApi } from "@/api";

export const usePropertiesStore = defineStore("properties", {
    state: () => ({
        items: [],
        loading: false,
        error: null,
        filters: {
            type: "all",
            city: "all",
            minPrice: "",
            maxPrice: ""
        }
    }),

    actions: {
        setFilters(partial) {
            this.filters = {
                ...this.filters,
                ...partial
            };
        },

        async load(filters = null) {
            this.error = null;
            this.loading = true;

            try {
                const f = filters ? { ...filters } : { ...this.filters };

                const params = {};

                if (f.type && f.type !== "all") {
                    params.type = f.type;
                }

                if (f.city && f.city !== "all") {
                    params.city = f.city;
                }

                if (f.minPrice !== "" && f.minPrice !== null && f.minPrice !== undefined) {
                    params.minPrice = Number(f.minPrice);
                }

                if (f.maxPrice !== "" && f.maxPrice !== null && f.maxPrice !== undefined) {
                    params.maxPrice = Number(f.maxPrice);
                }

                const res = await propertiesApi.getAll(params);
                const list = Array.isArray(res?.data) ? res.data : [];

                const withPhotos = await Promise.all(
                    list.map(async (p) => {
                        try {
                            const photosRes = await propertiesApi.getPhotosByProperty(p.property_id);
                            const photos = Array.isArray(photosRes?.data) ? photosRes.data : [];
                            const main = photos.length > 0 ? photos[0].photo_url : null;

                            return {
                                ...p,
                                main_photo_url: main
                            };
                        } catch {
                            return {
                                ...p,
                                main_photo_url: null
                            };
                        }
                    })
                );

                this.items = withPhotos;
                return true;
            } catch (e) {
                this.items = [];
                this.error = e?.response?.data?.message || e?.message || "Не удалось загрузить объявления";
                return false;
            } finally {
                this.loading = false;
            }
        }
    }
});

export default usePropertiesStore;