import { defineStore } from "pinia";
import recipeService from "@/api/recipe";
import router from "@/router";

export const useRecipeStore = defineStore("recipe", {
  state: () => ({
    recipes: [],
    recipe: {},
    ingredients: [],
  }),

  getters: {
    all: (state) => state.recipes,
  },

  actions: {
    async load(filter, userId) {
      try {
        const response = await recipeService.getAll(filter, userId);
        this.recipes = response.data;
      } catch (error) {
        this.recipes = [];
        throw error;
      }
    },

    async loadById(id) {
      try {
        const response = await recipeService.getById(id);
        this.recipe = response.data;
      } catch (error) {
        this.recipe = {};
        throw error;
      }
    },

    async loadIngredients() {
      try {
        const response = await recipeService.getIngredients();
        this.ingredients = response.data;
      } catch (error) {
        this.ingredients = [];
        throw error;
      }
    },

    geIngredientById(id) {
      for(const ingredient of this.ingredients) {
        if (ingredient.id === id) {
          return ingredient;
        }
      }
    },

    async create(recipeData) {
      try {
        const response = await recipeService.create(recipeData);
        if (response.status === 201) {
          await this.load();
          router.push(`/recipes/${response.data.id}`);
        }
      } catch (error) {
        throw error;
      }
    },

  },
});
