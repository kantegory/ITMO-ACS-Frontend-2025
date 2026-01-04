import { defineStore } from "pinia";
import { advertisementsApi } from "@/api";

const useAdvertisementsStore = defineStore("advertisements", {
  state: () => ({
    advertisements: [],
    filters: {
      location: "",
      livingType: "",
      priceFrom: null,
      priceTo: null,
    },
    currentAdvertisement: null,
  }),

  actions: {
    async loadAdvertisements() {
      const params = mapFiltersForApi(this.filters);
      const response = await advertisementsApi.getAll(params);
      this.advertisements = response.data?.content ?? [];
      return response;
    },

    async loadAdvertisementById(id) {
      const response = await advertisementsApi.getById(id);
      this.currentAdvertisement = response.data;
      return response;
    },

    async createAdvertisement(data) {
      const response = await advertisementsApi.createAdvertisement(data);

      const created = response.data;
      this.advertisements = [created, ...this.advertisements];

      return response;
    },

    async updateAdvertisement(id, data) {
      const response = await advertisementsApi.updateAdvertisement(id, data);

      const updated = response.data;
      const idx = this.advertisements.findIndex((a) => String(a.id) === String(id));
      if (idx !== -1) this.advertisements[idx] = updated;

      if (this.currentAdvertisement && String(this.currentAdvertisement.id) === String(id)) {
        this.currentAdvertisement = updated;
      }

      return response;
    },

    async deleteAdvertisement(id) {
      await advertisementsApi.deleteAdvertisement(id);

      this.advertisements = this.advertisements.filter((a) => String(a.id) !== String(id));
      if (this.currentAdvertisement && String(this.currentAdvertisement.id) === String(id)) {
        this.currentAdvertisement = null;
      }
    },

    clearAdvertisements() {
      this.advertisements = [];
    },
  },
});

function mapFiltersForApi(filters) {
  const params = {};

  if (filters.location?.trim()) {
    params.location = filters.location.trim();
  }
  if (filters.livingType) {
    params.living_type = filters.livingType;
  }

  if (Number.isFinite(filters.priceFrom)) {
    params.min_price = filters.priceFrom;
  }

  if (Number.isFinite(filters.priceTo)) {
    params.max_price = filters.priceTo;
  }

  return params;
}


export default useAdvertisementsStore;
