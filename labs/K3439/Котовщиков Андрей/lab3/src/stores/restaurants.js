import { defineStore } from "pinia";
import { restaurantsApi } from "@/api";

const useRestaurantsStore = defineStore("restaurants", {
  state: () => ({
    restaurants: [],
    menus: {},
  }),

  actions: {
    async fetchRestaurants({ city, cuisine, priceFrom }) {
      const filters = {};
      if (city) {
        filters.city = city;
      }

      if (cuisine) {
        filters.cuisines_like = cuisine;
      }

      if (priceFrom) {
        filters.priceFrom_gte = priceFrom;
      }

      const response = await restaurantsApi.filter(filters);
      this.restaurants = response.data;
    },

    async fetchMenus({ restaurantId }) {
      const response = await restaurantsApi.getMenus({ restaurantId });
      this.menus[restaurantId] = response.data;
    },
  },
});

export default useRestaurantsStore;
