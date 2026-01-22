<template>
  <main class="container" style="margin-top: 50px; margin-bottom: 50px;" role="main" tabindex="-1" aria-labelledby="blogHeading">
    <h2 id="blogHeading" class="mb-4">Блог о здоровье и питании</h2>
    
    <div class="row mb-4" role="search">
      <div class="col-md-6">
        <label for="blogSearch" class="form-label visually-hidden">Поиск по статьям</label>
        <input 
          type="text" 
          class="form-control" 
          id="blogSearch" 
          placeholder="Поиск по статьям..." 
          aria-label="Поиск по статьям"
          v-model="searchQuery"
        >
      </div>
      <div class="col-md-3">
        <label for="blogCategory" class="form-label visually-hidden">Фильтр по категории статей</label>
        <select class="form-select" id="blogCategory" aria-label="Фильтр по категории статей" v-model="categoryFilter">
          <option value="all">Все категории</option>
          <option value="nutrition">Питание</option>
          <option value="health">Здоровье</option>
          <option value="motivation">Мотивация</option>
        </select>
      </div>
    </div>

    <div class="row" role="list" aria-live="polite" aria-busy="false">
      <div v-if="loading" class="alert alert-info" role="listitem">
        Загружаем статьи...
      </div>
      <div v-else-if="posts.length === 0" class="col-12">
        <p class="text-muted">Статьи не найдены. Попробуйте изменить фильтры или поиск.</p>
      </div>
      <div v-else v-for="post in posts" :key="post.id" class="col-md-4" role="listitem">
        <BlogCard :post="post" />
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import BlogCard from '../components/BlogCard.vue';
import { useApi } from '../composables/useApi';
import { useBlogFilters } from '../composables/useFilters';

const { fetchBlogPosts } = useApi();

const posts = ref([]);
const loading = ref(true);
let blogRequestToken = 0;

const { searchQuery, categoryFilter, blogQuery } = useBlogFilters();

const loadPosts = async (query = {}) => {
  const currentRequest = ++blogRequestToken;
  loading.value = true;
  try {
    const data = await fetchBlogPosts(query);
    if (currentRequest === blogRequestToken) {
      posts.value = data;
      loading.value = false;
    }
  } catch (error) {
    console.error(error);
    if (currentRequest === blogRequestToken) {
      loading.value = false;
    }
  }
};

onMounted(() => {
  loadPosts();
});

watch(blogQuery, (query) => {
  loadPosts(query);
});
</script>
