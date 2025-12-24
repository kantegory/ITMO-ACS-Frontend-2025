import {ref} from 'vue'
import api from '../api/http'

export function useBlog() {
    const posts = ref([])
    const loading = ref(false)

    const loadPosts = async (filters = {}) => {
        loading.value = true
        try {
            const params = {}
            if (filters.category) params.category = filters.category
            if (filters.search) params.title_like = filters.search

            const {data} = await api.get('/blog_posts', {params})
            posts.value = data
        } finally {
            loading.value = false
        }
    }

    return {posts, loading, loadPosts}
}