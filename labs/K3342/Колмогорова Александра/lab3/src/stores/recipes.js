import { defineStore } from 'pinia'

const API_URL = 'http://localhost:3000'

export const useRecipesStore = defineStore('recipes', {
  state: () => ({
    recipes: [],
    loading: false,
    error: null
  }),
  
  actions: {
    async loadRecipes() {
      try {
        this.loading = true
        const response = await fetch(`${API_URL}/publicRecipes`)
        const data = await response.json()
        
        console.log('Загруженные рецепты:', data)
        
        let recipesData = data
        if (!Array.isArray(recipesData)) {
          recipesData = data.data || 
                       data.recipes || 
                       Object.values(data) || 
                       []
        }
        
        this.recipes = recipesData
        this.error = null
      } catch (error) {
        console.error('Ошибка загрузки рецептов:', error)
        this.error = 'Не удалось загрузить рецепты'
        this.recipes = []
      } finally {
        this.loading = false
      }
    },
    
    async searchRecipes(searchTerm) {
      try {
        this.loading = true
        const response = await fetch(`${API_URL}/publicRecipes?q=${searchTerm}`)
        const data = await response.json()
        
        console.log('Результаты поиска:', data)
        
        let recipesData = data
        if (!Array.isArray(recipesData)) {
          recipesData = data.data || 
                       data.recipes || 
                       Object.values(data) || 
                       []
        }
        
        this.recipes = recipesData
        this.error = null
      } catch (error) {
        console.error('Ошибка поиска:', error)
        this.error = 'Не удалось выполнить поиск'
        this.recipes = []
      } finally {
        this.loading = false
      }
    }
  }
})