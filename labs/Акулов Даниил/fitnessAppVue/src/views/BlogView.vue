<template>
    <div class="container mt-5 content">
        <h1 class="text-center">Блог о здоровье и питании</h1>
        <router-link :to="`/create-blog`" class="btn btn-link px-0 mb-3" :aria-label="`Создать пост`">Создать пост</router-link>
        <div class="row g-4">
            <div v-for="post in posts" :key="post.id" class="col-md-6">
                <BlogPost :post="post" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { blogApi } from '@/api'
import BlogPost from "@/components/BlogPost.vue";

const posts = ref([])

onMounted(async () => {
    posts.value = await blogApi.getPosts()
})
</script>
