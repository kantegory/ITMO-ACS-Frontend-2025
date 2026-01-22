<template>
    <div class="container mt-5 content" v-if="post">
        <div class="hero mb-4">
            <h1 class="text-center mb-2">{{ post.title }}</h1>
            <div class="text-end text-muted" style="font-size:.85rem">
                Создан: {{ getPrettyDate(post.createdAt) }}
            </div>
        </div>

        <section>
            <p class="lead-compact" style="white-space: pre-line">{{ post.content }}</p>
        </section>
    </div>
    <div v-else class="container mt-5 text-center">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { blogApi } from '@/api'
import { getPrettyDate } from '@/utils/date'

const route = useRoute()
const post = ref(null)

onMounted(async () => {
    const id = route.params.id
    if (id) {
        post.value = await blogApi.getPost(id)
        if (post.value) {
            document.title = post.value.title + ' - FitnessApp'
        }
    }
})
</script>
