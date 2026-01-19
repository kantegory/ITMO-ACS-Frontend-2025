import { defineStore } from "pinia"
import { recipesApi } from "@/api"

export const useRecipesStore = defineStore("recipes", {
  state: () => ({
    list: [],
    loading: false
  }),
  actions: {
    async load() {
      this.loading = true
      try {
        const { data } = await recipesApi.getAll()
        this.list = Array.isArray(data) ? data : []
      } finally {
        this.loading = false
      }
    },

    async loadFiltered(filters) {
      this.loading = true
      try {
        const { data } = await recipesApi.search(filters)
        this.list = Array.isArray(data) ? data : []
      } finally {
        this.loading = false
      }
    }
  }
})
