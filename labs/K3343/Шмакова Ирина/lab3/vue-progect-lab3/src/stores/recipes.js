import { defineStore } from 'pinia'
import { recipesApi } from '@/api'

const useRecipesStore = defineStore('recipes', {
  state: () => ({
    recipes: []
  }),

  persist: true,

  actions: {
    async loadRecipes() {
      const response = await recipesApi.getAll()
      this.recipes = response.data
      return response
    },

    async createRecipe(data) {
      const response = await recipesApi.createRecipe(data)
      this.recipes = response.data
      return response
    },

    async updateRecipe(id, data) {
      const response = await recipesApi.updateRecipe(id, data)
      
      const index = this.recipes.findIndex(recipe => recipe.id === id)
      if (index !== -1) {
        this.recipes[index] = response.data
      }
      
      return response
    },

    async deleteRecipe(id) {
      const response = await recipesApi.deleteRecipe(id)
      this.recipes = this.recipes.filter(recipe => recipe.id !== id)
      return response
    }
  }
})

export default useRecipesStore
