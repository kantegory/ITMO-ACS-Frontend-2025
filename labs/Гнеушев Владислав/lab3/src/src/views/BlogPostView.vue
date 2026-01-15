<template>
  <main class="container" style="margin-top: 50px; margin-bottom: 50px;" role="main" tabindex="-1" aria-labelledby="postTitle">
    <div class="row">
      <div class="col-12 mb-4">
        <h2 id="postTitle">{{ post?.title || 'Загрузка...' }}</h2>
        <p id="postCategory">{{ post ? `Категория: ${categoryNames[post.category] || '-'}` : '' }}</p>
        <p id="postDate">{{ post ? `Дата: ${post.date}` : '' }}</p>
        <p id="postAuthor">{{ post ? `Автор: ${post.author}` : '' }}</p>
      </div>
    </div>

    <div class="row mb-4" v-if="post">
      <div class="col-12">
        <img :src="post.image" alt="Изображение статьи" class="img-fluid mb-4" id="postImage">
        <div id="postContent" v-html="post.content"></div>
      </div>
    </div>

    <div class="row" v-if="post">
      <div class="col-12">
        <router-link to="/blog" class="btn btn-secondary">← Назад к блогу</router-link>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useApi } from '../composables/useApi';
import { categoryNames } from '../composables/useFilters';

const route = useRoute();
const { fetchBlogPostById } = useApi();

const post = ref(null);

onMounted(async () => {
  const postId = parseInt(route.params.id, 10);
  
  if (!Number.isFinite(postId)) {
    return;
  }

  try {
    post.value = await fetchBlogPostById(postId);
  } catch (error) {
    console.error(error);
  }
});
</script>
