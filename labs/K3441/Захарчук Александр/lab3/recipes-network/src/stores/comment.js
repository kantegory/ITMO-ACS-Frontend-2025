import { defineStore } from "pinia";
import commentService from "@/api/comment";

export const useCommentStore = defineStore("comment", {
  state: () => ({
    comments: [],
  }),

  getters: {
    all: (state) => state.comments,
  },

  actions: {
    async create(recipeId, commentText) {
      try {
        await commentService.create(recipeId, commentText);
        await this.getByRecipeId(recipeId);
      } catch (error) {
        throw error;
      }
    },

    async getByRecipeId(id) {
      try {
        const response = await commentService.getByRecipeId(id);
        this.comments = response.data;
      } catch (error) {
        this.comments = [];
        throw error;
      }
    },
  },
});
