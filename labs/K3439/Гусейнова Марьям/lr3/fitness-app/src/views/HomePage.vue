<template>
  <section class="page-section d-block" aria-label="Главная страница с анонсами">
    <div class="hero-block p-5 text-center rounded-3 shadow-lg">
      <h1 class="text-success display-4 fw-bold mb-3">Твой путь к здоровой жизни!</h1>
      <p class="lead">Платформа FitLife поможет тебе отслеживать прогресс, находить идеальные тренировки и узнавать новое о питании.</p>
      <router-link class="btn btn-lg btn-primary mt-3 me-2" to="/search">Начать тренировку</router-link>
      <router-link class="btn btn-lg btn-outline-secondary mt-3" to="/register">Присоединиться</router-link>
    </div>

    <!-- Блог о здоровье и питании -->
    <h2 class="mt-5 mb-4 text-center fw-bold">Блог о Здоровье и Питании</h2>
    <div class="row row-cols-1 row-cols-md-3 g-4" role="region" aria-label="Последние посты в блоге">
      <div v-for="post in blogPosts" :key="post.id" class="col">
        <BlogPostCard :post="post" />
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useApi } from '../composables/useApi'
import BlogPostCard from '../components/BlogPostCard.vue'

export default {
  name: 'HomePage',
  components: {
    BlogPostCard
  },
  setup() {
    const { get } = useApi()
    const blogPosts = ref([])

    const loadBlogPosts = async () => {
      try {
        blogPosts.value = await get('/blogPosts')
      } catch (error) {
        console.error('Ошибка загрузки блог-постов:', error)
      }
    }

    onMounted(() => {
      loadBlogPosts()
    })

    return {
      blogPosts
    }
  }
}
</script>