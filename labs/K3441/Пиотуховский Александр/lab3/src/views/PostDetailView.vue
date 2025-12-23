<template>
  <main id="main-content">
    <div v-if="loading" class="container py-5">
      <div class="loading-spinner">
        <div class="spinner"></div>
      </div>
    </div>

    <div v-else-if="error" class="container py-5">
      <div class="alert alert-danger">{{ error }}</div>
    </div>

    <section v-else-if="post" class="post-detail-section py-4">
      <div class="container">
        <div class="d-flex align-items-center mb-4">
          <img
            :src="author?.photoUrl || 'https://placehold.co/60x60/999/fff?text=?'"
            :alt="author?.username || 'User'"
            class="rounded-circle me-3"
            width="60"
            height="60"
          />
          <div>
            <h5 class="mb-1">{{ author?.firstName || 'Пользователь' }} {{
                author?.lastName || ''
              }}</h5>
            <small class="text-muted">{{ formattedDate }}</small>
          </div>
        </div>

        <h1 class="fw-bold mb-3">{{ post.title }}</h1>

        <div class="d-flex gap-2 mb-4">
          <button
            v-if="authStore.isLoggedIn"
            class="btn btn-outline-primary"
            @click="toggleFavorite"
          >
            <svg class="icon" aria-hidden="true" width="16" height="16">
              <use href="/src/assets/images/icons-sprite.svg#icon-heart"></use>
            </svg>
            {{ isFavorite ? 'В избранном' : 'Сохранить' }}
          </button>

          <button
            v-if="canEdit"
            class="btn btn-outline-secondary"
            @click="editPost"
          >
            Редактировать
          </button>

          <button
            v-if="canDelete"
            class="btn btn-outline-danger"
            @click="deletePost"
          >
            Удалить
          </button>
        </div>

        <div class="post-content mb-4">
          <div id="post-content-text" v-html="parseMarkdown(post.content)"></div>
        </div>

        <div v-if="post.images && post.images.length > 0" id="post-images-section"
             class="post-images mb-4">
          <h3 class="fw-bold mb-4">
            <svg class="icon" aria-hidden="true" width="20" height="20">
              <use href="/src/assets/images/icons-sprite.svg#icon-images"></use>
            </svg>
            Фотографии
          </h3>
          <div id="post-images">
            <div
              v-for="image in sortedImages"
              :key="image.id"
              class="post-image"
            >
              <img :src="image.imageUrl" :alt="`Post image ${image.displayOrder}`"/>
            </div>
          </div>
        </div>

        <div v-if="postRecipes.length > 0" id="post-recipes-section" class="post-recipes mb-4">
          <h3 class="fw-bold mb-4">
            <svg class="icon" aria-hidden="true" width="20" height="20">
              <use href="/src/assets/images/icons-sprite.svg#icon-book"></use>
            </svg>
            Рецепты
          </h3>
          <div id="post-recipes">
            <RecipeCardMini
              v-for="recipe in postRecipes"
              :key="recipe.id"
              :recipe="recipe"
              :author="getRecipeAuthor(recipe.authorId)"
            />
          </div>
        </div>

        <section class="comments-section">
          <h2 class="fw-bold mb-4 h3">
            <svg class="icon" aria-hidden="true" width="20" height="20">
              <use href="/src/assets/images/icons-sprite.svg#icon-chat-dots"></use>
            </svg>
            Комментарии (<span>{{ comments.length }}</span>)
          </h2>

          <div v-if="authStore.isLoggedIn" class="mb-4">
            <form class="comment-form" @submit.prevent="addComment">
              <textarea
                v-model="newComment"
                class="form-control mb-3"
                rows="3"
                placeholder="Напишите комментарий..."
                required
              ></textarea>
              <button type="submit" class="btn btn-primary">
                <svg class="icon" aria-hidden="true" width="16" height="16">
                  <use href="/src/assets/images/icons-sprite.svg#icon-send"></use>
                </svg>
                Отправить
              </button>
            </form>
          </div>

          <div v-if="comments.length === 0" class="text-muted text-center py-4">
            Комментариев пока нет
          </div>

          <div id="comments-list">
            <CommentItem
              v-for="comment in rootComments"
              :key="comment.id"
              :comment="comment"
              :author="getCommentAuthor(comment.userId)"
              :current-user-id="authStore.currentUser?.id"
              :all-comments="comments"
              :all-users="users"
              @edit="handleEditComment"
              @delete="handleDeleteComment"
            />
          </div>
        </section>
      </div>
    </section>
  </main>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useAuthStore} from '@/stores/auth'
import {useApi} from '@/composables/useApi'
import {useFormatters} from '@/composables/useFormatters'
import {useToast} from '@/composables/useToast'
import CommentItem from '@/components/common/CommentItem.vue'
import RecipeCardMini from '@/components/recipes/RecipeCardMini.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const api = useApi()
const {formatDate, parseMarkdown} = useFormatters()
const {showToast} = useToast()

const post = ref(null)
const author = ref(null)
const comments = ref([])
const users = ref([])
const recipes = ref([])
const loading = ref(true)
const error = ref(null)
const newComment = ref('')
const isFavorite = ref(false)

const formattedDate = computed(() => {
  return formatDate(post.value?.createdAt)
})

const canEdit = computed(() => {
  return authStore.currentUser?.id === post.value?.authorId
})

const canDelete = computed(() => {
  return authStore.currentUser?.id === post.value?.authorId
})

const sortedImages = computed(() => {
  if (!post.value?.images) return []
  return [...post.value.images].sort((a, b) => a.displayOrder - b.displayOrder)
})

const postRecipes = computed(() => {
  if (!post.value?.recipes || !recipes.value.length) return []

  return post.value.recipes
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map(pr => recipes.value.find(r => r.id === pr.recipeId))
    .filter(r => r)
})

const rootComments = computed(() => {
  return comments.value.filter(c => !c.parentId || c.parentId === null)
})

const getCommentAuthor = (userId) => {
  return users.value.find((u) => u.id === userId)
}

const getRecipeAuthor = (authorId) => {
  return users.value.find((u) => u.id === authorId)
}

const toggleFavorite = async () => {
  if (!authStore.currentUser) return

  try {
    if (isFavorite.value) {
      await api.removePostFromFavorites(post.value.id, authStore.currentUser.id)
      isFavorite.value = false
      showToast('Пост удален из избранного', 'success')
    } else {
      await api.addPostToFavorites(post.value.id, authStore.currentUser.id)
      isFavorite.value = true
      showToast('Пост добавлен в избранное', 'success')
    }
  } catch (err) {
    showToast('Ошибка при обновлении избранного', 'error')
  }
}

const addComment = async () => {
  if (!newComment.value.trim()) return

  try {
    await api.createComment({
      content: newComment.value,
      userId: authStore.currentUser.id,
      commentableType: 'post',
      commentableId: post.value.id
    })

    newComment.value = ''
    await loadComments()
    showToast('Комментарий добавлен', 'success')
  } catch (err) {
    showToast('Ошибка при добавлении комментария', 'error')
  }
}

const handleEditComment = async ({id, content}) => {
  try {
    await api.updateComment(id, content)
    await loadComments()
    showToast('Комментарий обновлен', 'success')
  } catch (err) {
    showToast('Ошибка при обновлении комментария', 'error')
  }
}

const handleDeleteComment = async (id) => {
  if (!confirm('Удалить комментарий?')) return

  try {
    await api.deleteComment(id)
    await loadComments()
    showToast('Комментарий удален', 'success')
  } catch (err) {
    showToast('Ошибка при удалении комментария', 'error')
  }
}

const editPost = () => {
  router.push(`/post/${post.value.id}/edit`)
}

const deletePost = async () => {
  if (!confirm('Удалить пост?')) return

  try {
    await api.deletePost(post.value.id)
    showToast('Пост удален', 'success')
    router.push('/')
  } catch (err) {
    showToast('Ошибка при удалении поста', 'error')
  }
}

const loadComments = async () => {
  try {
    const response = await api.getComments('post', post.value.id)
    comments.value = response.data
  } catch (err) {
    console.error('Failed to load comments:', err)
  }
}

onMounted(async () => {
  const postId = parseInt(route.params.id)

  try {
    const [postRes, usersRes, recipesRes] = await Promise.all([
      api.getPost(postId),
      api.getUsers().catch(() => ({data: []})),
      api.getRecipes().catch(() => ({data: []}))
    ])

    post.value = postRes.data
    users.value = usersRes.data
    recipes.value = recipesRes.data

    if (post.value.authorId) {
      author.value = users.value.find((u) => u.id === post.value.authorId)
    }

    await loadComments()

    if (authStore.currentUser) {
      const favoritesRes = await api.getUserFavoritePosts(authStore.currentUser.id)
      isFavorite.value = favoritesRes.data.some((p) => p.id === post.value.id)
    }
  } catch (err) {
    error.value = 'Не удалось загрузить пост'
  } finally {
    loading.value = false
  }
})
</script>
