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

    <section v-else-if="recipe" class="recipe-detail-section">
      <div class="container">
        <h1 class="mb-3">{{ recipe.title }}</h1>

        <div class="mb-3" id="recipe-meta">
          <div class="d-flex align-items-center gap-3">
            <div class="d-flex align-items-center">
              <img
                :src="author?.photoUrl || 'https://placehold.co/50x50/999/fff?text=?'"
                :alt="author?.username || 'User'"
                class="rounded-circle me-2"
                style="width: 50px; height: 50px;"
              />
              <div>
                <strong>{{ author?.firstName || 'Пользователь' }} {{
                    author?.lastName || ''
                  }}</strong>
                <div class="small text-muted">{{ formattedDate }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-3" id="recipe-tags">
          <span v-if="recipe.dishType"
                class="badge bg-light text-dark me-2">{{ recipe.dishType.title }}</span>
          <span v-if="recipe.difficulty" class="badge" :class="difficultyBadge.class">
            {{ difficultyBadge.text }}
          </span>
        </div>

        <div class="row g-4">
          <div class="col-lg-8">
            <div v-if="recipe.description" class="recipe-description mb-4">
              <h4 class="mb-3">Описание</h4>
              <p>{{ recipe.description }}</p>
            </div>

            <div v-if="recipe.blocks && recipe.blocks.length > 0" class="recipe-blocks mb-5">
              <h4 class="mb-4">Приготовление</h4>
              <div id="recipe-blocks">
                <div
                  v-for="block in recipe.blocks"
                  :key="block.id"
                  class="recipe-block"
                >
                  <div v-if="block.blockType === 'text'" class="recipe-block-text">
                    <div v-html="parseMarkdown(block.content)"></div>
                  </div>
                  <div v-else-if="block.blockType === 'image'" class="recipe-block-image">
                    <img
                      :src="block.content"
                      :alt="`Шаг ${block.displayOrder}`"
                      class="img-fluid"
                    />
                  </div>
                </div>
              </div>
            </div>

            <section class="comments-section">
              <h2 class="mb-4 h4">
                Комментарии <span class="comments-count text-muted">({{ comments.length }})</span>
              </h2>

              <div v-if="authStore.isLoggedIn" class="mb-4">
                <form class="comment-form" @submit.prevent="addComment">
                  <textarea
                    v-model="newComment"
                    class="form-control mb-3"
                    rows="3"
                    placeholder="Поделитесь своим мнением о рецепте..."
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

              <div v-if="comments.length === 0" class="text-muted">
                Пока нет комментариев. Будьте первым!
              </div>

              <div v-else id="comments-list">
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

          <aside class="col-lg-4">
            <div v-if="recipe.ingredients && recipe.ingredients.length > 0"
                 class="ingredients-card mb-4">
              <h2 class="mb-3 h5">
                Ингредиенты
              </h2>
              <ul class="ingredients-list">
                <li
                  v-for="item in recipe.ingredients"
                  :key="item.id"
                  class="ingredient-item"
                >
                  <input
                    type="checkbox"
                    :id="`ingredient-${item.id}`"
                    v-model="checkedIngredients[item.id]"
                    class="ingredient-checkbox"
                  />
                  <label :for="`ingredient-${item.id}`" class="ingredient-label">
                    <span class="ingredient-name"
                          :class="{ 'checked': checkedIngredients[item.id] }">
                      {{ item.name }}
                    </span>
                    <span v-if="item.quantity" class="ingredient-quantity"
                          :class="{ 'checked': checkedIngredients[item.id] }">
                      {{ item.quantity }} {{ item.unit }}
                    </span>
                  </label>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {useRoute, useRouter, RouterLink} from 'vue-router'
import {useAuthStore} from '@/stores/auth'
import {useApi} from '@/composables/useApi'
import {useFormatters} from '@/composables/useFormatters'
import {useToast} from '@/composables/useToast'
import CommentItem from '@/components/common/CommentItem.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const api = useApi()
const {formatDate, getDifficultyBadge, parseMarkdown} = useFormatters()
const {showToast} = useToast()

const recipe = ref(null)
const author = ref(null)
const comments = ref([])
const users = ref([])
const loading = ref(true)
const error = ref(null)
const newComment = ref('')
const isFavorite = ref(false)
const checkedIngredients = ref({})

const formattedDate = computed(() => {
  return formatDate(recipe.value?.createdAt)
})

const difficultyBadge = computed(() => {
  return getDifficultyBadge(recipe.value?.difficulty)
})

const canEdit = computed(() => {
  return authStore.currentUser?.id === recipe.value?.authorId
})

const canDelete = computed(() => {
  return authStore.currentUser?.id === recipe.value?.authorId
})

const rootComments = computed(() => {
  return comments.value.filter(c => !c.parentId || c.parentId === null)
})

const getCommentAuthor = (userId) => {
  return users.value.find((u) => u.id === userId)
}

const toggleFavorite = async () => {
  if (!authStore.currentUser) return

  try {
    if (isFavorite.value) {
      await api.removeRecipeFromFavorites(recipe.value.id, authStore.currentUser.id)
      isFavorite.value = false
      showToast('Рецепт удален из избранного', 'success')
    } else {
      await api.addRecipeToFavorites(recipe.value.id, authStore.currentUser.id)
      isFavorite.value = true
      showToast('Рецепт добавлен в избранное', 'success')
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
      commentableType: 'recipe',
      commentableId: recipe.value.id
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

const editRecipe = () => {
  router.push(`/recipe/${recipe.value.id}/edit`)
}

const deleteRecipe = async () => {
  if (!confirm('Удалить рецепт?')) return

  try {
    await api.deleteRecipe(recipe.value.id)
    showToast('Рецепт удален', 'success')
    router.push('/')
  } catch (err) {
    showToast('Ошибка при удалении рецепта', 'error')
  }
}

const loadComments = async () => {
  try {
    const response = await api.getComments('recipe', recipe.value.id)
    comments.value = response.data
  } catch (err) {
    console.error('Failed to load comments:', err)
  }
}

onMounted(async () => {
  const recipeId = parseInt(route.params.id)

  try {
    const [recipeRes, usersRes] = await Promise.all([
      api.getRecipe(recipeId),
      api.getUsers().catch(() => ({data: []}))
    ])

    recipe.value = recipeRes.data
    users.value = usersRes.data

    if (recipe.value.authorId) {
      author.value = users.value.find((u) => u.id === recipe.value.authorId)
    }

    await loadComments()

    if (authStore.currentUser) {
      const favoritesRes = await api.getUserFavoriteRecipes(authStore.currentUser.id)
      isFavorite.value = favoritesRes.data.some((r) => r.id === recipe.value.id)
    }
  } catch (err) {
    error.value = 'Не удалось загрузить рецепт'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.avatar-circle-small {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.icon {
  width: 20px;
  height: 20px;
  margin-right: 0.25rem;
}

.recipe-block {
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--bs-border-color);
}

.recipe-block:last-child {
  border-bottom: none;
}

.ingredient-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ingredient-checkbox {
  margin: 0;
  cursor: pointer;
}

.ingredient-label {
  display: flex;
  justify-content: space-between;
  flex: 1;
  cursor: pointer;
  margin: 0;
}

.ingredient-name.checked,
.ingredient-quantity.checked {
  text-decoration: line-through;
  opacity: 0.6;
}
</style>
