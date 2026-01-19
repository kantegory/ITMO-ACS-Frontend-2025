import { defineStore } from "pinia"
import { mealdbApi } from "@/api/mealDB"

export const useMealdbFiltersStore = defineStore("mealdbFilters", {
  state: () => ({
    categories: [],
    ingredients: [],
    areas: [],
    loading: false
  }),

  actions: {
    async loadAll() {
      this.loading = true
      try {
        const [cats, ings, areas] = await Promise.all([
          mealdbApi.getCategories(),
          mealdbApi.getIngredientsList(),
          mealdbApi.getAreasList()
        ])

        this.categories = cats.data?.categories ?? []
        this.ingredients = (ings.data?.meals ?? []).map(x => x.strIngredient).filter(Boolean)
        this.areas = (areas.data?.meals ?? []).map(x => x.strArea).filter(Boolean)
      } finally {
        this.loading = false
      }
    }
  }
})
