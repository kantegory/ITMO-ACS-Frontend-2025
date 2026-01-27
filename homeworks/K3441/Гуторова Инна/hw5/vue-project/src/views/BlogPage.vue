<template>
  <div class="container my-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Блог о здоровье и питании</h2>

      <button class="btn btn-primary" @click="openModal">Добавить пост</button>
    </div>

    <div v-if="loading">Загрузка...</div>
    <div class="row g-4">
      <div class="col-12" v-for="post in posts" :key="post.id">
        <blog-post-card
          :title="post.title"
          :text="post.text"
          :date="post.date"
          :image="post.image"
        />
      </div>
    </div>

    <add-post-modal ref="modal" @submit="createPostHandler" />
  </div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import useBlogStore from "@/stores/blog";

import BlogPostCard from "@/components/BlogPostCard.vue";
import AddPostModal from "@/components/AddPostModal.vue";

export default {
  name: "BlogPage",

  components: {
    BlogPostCard,
    AddPostModal,
  },

  computed: {
    ...mapState(useBlogStore, ["posts", "loading"]),
  },

  methods: {
    ...mapActions(useBlogStore, ["loadPosts", "createPost"]),

    openModal() {
      this.$refs.modal.open();
    },

    async createPostHandler(postData) {
      if (!postData || !postData.title) return;
      const payload = {
        ...postData,
        date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
        image: "https://picsum.photos/seed/new/600/400",
      };
      await this.createPost(payload);
      await this.loadPosts();
    },
  },

  mounted() {
    this.loadPosts();
  },
};
</script>
