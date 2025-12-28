import { defineStore } from "pinia";

const useCommentsStore = defineStore("comments", {
  state: () => ({
    comments: [],
  }),

  actions: {
    async addComment({ text }) {
      const comment = { text, date: new Date().toLocaleString() };
      this.comments.push(comment);
    },
  },
});

export default useCommentsStore;
