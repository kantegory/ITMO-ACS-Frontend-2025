// src/composables/useBlog.js
import { ref } from 'vue'
import { useApi } from './useApi'
import { useAuth } from './useAuth'

const MAX_LENGTH = 500

export function useBlog() {
  const api = useApi()
  const { user, token } = useAuth()

  const posts = ref([])
  const loading = ref(false)
  const error = ref(null)

  const loadPosts = async () => {
    try {
      loading.value = true

      const [usersRes, postsRes] = await Promise.all([
        api.get('/users'),
        api.get('/posts')
      ])

      const users = usersRes
      const rawPosts = postsRes.reverse()

      posts.value = rawPosts.map(post => {
        const author = users.find(u => u.id === post.author)

        const isLong = post.text.length > MAX_LENGTH
        const shortText = isLong
          ? post.text.slice(0, MAX_LENGTH) + '...'
          : post.text

        return {
          ...post,
          authorName: author?.name || 'Неизвестно',
          shortText,
          isLong,
          expanded: false
        }
      })
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  const addPost = async (data) => {
    if (!token.value) {
      throw new Error('Вы не авторизованы')
    }

    const newPost = {
      ...data,
      author: user.value.id,
      date: new Date().toISOString().split('T')[0]
    }

    await api.post('/posts', newPost)
    await loadPosts()
  }

  return {
    posts,
    loading,
    error,
    loadPosts,
    addPost
  }
}
