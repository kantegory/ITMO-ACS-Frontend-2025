import { defineStore } from 'pinia'
import { blogApi } from '@/api'

const useBlogStore = defineStore('blog', {
  state: () => ({
    posts: []
  }),

  actions: {
    async loadPosts() {
      const response = await blogApi.getAll()
      this.posts = response.data
      return response
    },

    async createPost(data) {
      const response = await blogApi.createPost(data)
      this.posts = response.data
      return response
    }
  }
})

export default useBlogStore
