import { defineStore } from "pinia";
import { propertiesApi } from "@/api";
import { useApiError } from "@/composables/useApiError";
import { usePhotoUrls } from "@/composables/usePhotoUrls";

export const useMyPropertiesStore = defineStore("myProperties", {
    state: () => ({
        items: [],
        loading: false,
        error: null
    }),

    actions: {
        async loadMine(ownerId) {
            const { normalize } = useApiError();
            this.error = null;
            this.loading = true;

            try {
                const res = await propertiesApi.getMine(ownerId);
                const list = Array.isArray(res?.data) ? res.data : [];

                const withPhotos = await Promise.all(
                    list.map(async (p) => {
                        try {
                            const photosRes = await propertiesApi.getPhotosByProperty(p.property_id);
                            const photos = Array.isArray(photosRes?.data) ? photosRes.data : [];
                            const main = photos.length > 0 ? photos[0].photo_url : null;
                            return { ...p, main_photo_url: main };
                        } catch {
                            return { ...p, main_photo_url: null };
                        }
                    })
                );

                this.items = withPhotos;
                return true;
            } catch (e) {
                this.items = [];
                this.error = normalize(e, "Не удалось загрузить ваши объявления");
                return false;
            } finally {
                this.loading = false;
            }
        },

        async uploadPhotos(propertyId, photoUrlsText) {
            const { parse } = usePhotoUrls();
            const urls = parse(photoUrlsText);
            if (urls.length === 0) return true;

            await Promise.all(
                urls.map((url) =>
                    propertiesApi.addPhoto({ property_id: propertyId, photo_url: url })
                )
            );

            return true;
        },

        async create(ownerId, dto, photoUrlsText) {
            const { normalize } = useApiError();
            this.error = null;
            this.loading = true;

            try {
                const payload = { ...dto, owner_id: ownerId };
                const res = await propertiesApi.create(payload);
                const created = res?.data || null;
                const newId = created?.property_id || null;

                if (newId) await this.uploadPhotos(newId, photoUrlsText);

                await this.loadMine(ownerId);
                return true;
            } catch (e) {
                this.error = normalize(e, "Не удалось создать объявление");
                return false;
            } finally {
                this.loading = false;
            }
        },

        async update(ownerId, propertyId, dto, photoUrlsText) {
            const { normalize } = useApiError();
            this.error = null;
            this.loading = true;

            try {
                await propertiesApi.update(propertyId, dto);
                await this.uploadPhotos(propertyId, photoUrlsText);
                await this.loadMine(ownerId);
                return true;
            } catch (e) {
                this.error = normalize(e, "Не удалось обновить объявление");
                return false;
            } finally {
                this.loading = false;
            }
        },

        async remove(ownerId, propertyId) {
            const { normalize } = useApiError();
            this.error = null;
            this.loading = true;

            try {
                await propertiesApi.remove(propertyId);
                await this.loadMine(ownerId);
                return true;
            } catch (e) {
                this.error = normalize(e, "Не удалось удалить объявление");
                return false;
            } finally {
                this.loading = false;
            }
        }
    }
});

export default useMyPropertiesStore;