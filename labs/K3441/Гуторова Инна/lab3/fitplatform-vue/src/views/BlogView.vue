<template>
  <div class="container my-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Блог о здоровье и питании</h2>
      <button
        v-if="!isAuthenticated"
        class="btn btn-primary"
        @click="openModal"
      >
        Добавить пост
      </button>
    </div>

    <p v-if="error" class="text-danger">{{ error }}</p>
    <p v-if="loading">Загрузка...</p>

    <BlogPost
      v-for="post in posts"
      :key="post.id"
      :post="post"
    />

    <AddPostModal ref="modal" @submit="addPost" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useBlog } from '@/composables/useBlog'
import { useAuth } from '@/composables/useAuth'

import BlogPost from '@/components/BlogPost.vue'
import AddPostModal from '@/components/AddPostModal.vue'

const { posts, loadPosts, addPost, loading, error } = useBlog()
const { isAuthenticated } = useAuth()

const modal = ref(null)

const openModal = () => {
  modal.value.open()
}

onMounted(loadPosts)
</script>
