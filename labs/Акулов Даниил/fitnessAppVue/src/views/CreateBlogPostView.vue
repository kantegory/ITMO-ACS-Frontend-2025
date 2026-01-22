<template>
    <div class="container mt-4">
        <h2 class="text-center mb-4">Создать новый пост</h2>
        <form @submit.prevent="handleCreate">
            <div class="mb-3">
                <label for="title" class="form-label">Название</label>
                <input type="text" class="form-control" id="title" v-model="title" required>
            </div>
            <div class="mb-3">
                <label for="content" class="form-label">Контент</label>
                <input type="text" class="form-control" id="content" v-model="content" required>
            </div>
            <button type="submit" class="btn btn-primary">Создать</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import {useRouter} from 'vue-router'
import { blogApi } from '@/api'

const router = useRouter()
const title = ref('')
const content = ref('')

const handleCreate = async () => {
    const result = await blogApi.createPost(title.value, content.value)
    if (result.success) {
        alert('Успех!')
        router.push('/blog/', result.post.id)
    } else {
        alert(result.message)
    }
}
</script>
